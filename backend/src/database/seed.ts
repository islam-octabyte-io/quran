import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import * as schema from './schema';

/**
 * Imports the raw Quran data (data-collection/quran) into Postgres.
 *
 * - CSV string ids are normalized into UCIs: zero padding stripped
 *   (QA01 -> QA1) and the ruku prefix collision fixed (rukus.csv reuses QJ,
 *   which belongs to juzs; rukus get QK).
 * - Division membership columns on ayahs are derived from the range tables.
 * - Per-surah bismillah is read from quran-text-simple.xml (the wording
 *   varies: surahs 95 and 97 differ) and stored on the first ayah's
 *   ayah_texts row for the edition.
 *
 * Idempotent: truncates all Quran tables before inserting.
 */

const DATA_DIR = join(process.cwd(), 'data-collection', 'quran');
const TRANSLATIONS_DIR = join(
  process.cwd(),
  'data-collection',
  'quran-translations',
);
const EDITION_NUMBER = 1;
const EDITION_UCI = `QE${EDITION_NUMBER}`;
const EDITION_SLUG = 'quran-simple';
const CHUNK_SIZE = 500;

/** Translation editions to seed from Tanzil-format TXT files. */
const TRANSLATIONS = [
  {
    number: 2,
    slug: 'ur-kanzuliman',
    name: 'Kanz ul Iman (Ahmed Raza Khan)',
    language: 'ur',
    file: 'ur_kanzuliman.txt',
  },
];

/** 'QT' + edition number + ayah number padded to 4 digits, e.g. QT10262. */
function ayahTextUci(editionNumber: number, ayahNumber: number): string {
  return `QT${editionNumber}${String(ayahNumber).padStart(4, '0')}`;
}

/** Parse a headered CSV (verified: no quoting, no commas in values). */
function readCsv(file: string): Record<string, string>[] {
  const lines = readFileSync(join(DATA_DIR, file), 'utf-8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const header = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    if (values.length !== header.length) {
      throw new Error(`${file}: malformed row: ${line}`);
    }
    return Object.fromEntries(header.map((h, i) => [h, values[i]]));
  });
}

/** 'QA01' -> 1 (numeric part of a raw CSV id). */
function idNumber(rawId: string): number {
  const match = /^[A-Z]+0*(\d+)$/.exec(rawId);
  if (!match) throw new Error(`Unexpected id format: ${rawId}`);
  return Number(match[1]);
}

function uci(prefix: string, number: number): string {
  return `${prefix}${number}`;
}

/**
 * Parse a Tanzil translation TXT ('sura|aya|text' lines, '#' footer) into a
 * map keyed by 'sura:aya'. Text is taken verbatim (may contain commas).
 */
function readTranslation(file: string): Map<string, string> {
  const result = new Map<string, string>();
  const lines = readFileSync(join(TRANSLATIONS_DIR, file), 'utf-8').split(
    '\n',
  );
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split('|');
    if (parts.length !== 3) throw new Error(`${file}: malformed line: ${line}`);
    result.set(`${Number(parts[0])}:${Number(parts[1])}`, parts[2]);
  }
  return result;
}

/** Per-surah bismillah text from the Tanzil XML (attribute on aya 1). */
function readBismillahs(): Map<number, string> {
  const xml = readFileSync(join(DATA_DIR, 'quran-text-simple.xml'), 'utf-8');
  const result = new Map<number, string>();
  let currentSurah = 0;
  for (const line of xml.split('\n')) {
    const sura = /<sura index="(\d+)"/.exec(line);
    if (sura) currentSurah = Number(sura[1]);
    const bismillah = /bismillah="([^"]+)"/.exec(line);
    if (bismillah) result.set(currentSurah, bismillah[1]);
  }
  return result;
}

interface Range {
  number: number;
  start: number;
  end: number;
}

function rangeLookup(ranges: Range[], label: string) {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  return (ayahNumber: number): number => {
    const hit = sorted.find(
      (r) => ayahNumber >= r.start && ayahNumber <= r.end,
    );
    if (!hit) throw new Error(`No ${label} covers ayah ${ayahNumber}`);
    return hit.number;
  };
}

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  const surasCsv = readCsv('suras.csv');
  const juzsCsv = readCsv('juzs.csv');
  const hizbsCsv = readCsv('hizbs.csv');
  const rubsCsv = readCsv('rubs.csv');
  const rukusCsv = readCsv('rukus.csv');
  const manzilsCsv = readCsv('manzils.csv');
  const ayasCsv = readCsv('ayas.csv');
  const bismillahs = readBismillahs();

  await db.execute(sql`
    TRUNCATE ayah_texts, ayahs, rukus, rubs, hizbs, manzils, juzs, editions, surahs
  `);

  await db.insert(schema.surahs).values(
    surasCsv.map((row) => {
      const number = Number(row.number);
      return {
        uci: uci('QS', number),
        number,
        nameArabic: row.name,
        nameEnglish: row.en_name,
        revelationPlace: row.type.toLowerCase() as 'meccan' | 'medinan',
        revelationOrder: Number(row.revelation_order),
        ayahCount: Number(row.total_ayas),
        rukuCount: Number(row.total_rukus),
        bismillahPrefix: number !== 1 && number !== 9,
      };
    }),
  );

  const juzRanges: Range[] = juzsCsv.map((row) => ({
    number: Number(row.number),
    start: idNumber(row.start_aya),
    end: idNumber(row.end_aya),
  }));
  await db.insert(schema.juzs).values(
    juzRanges.map((juz) => ({
      uci: uci('QJ', juz.number),
      number: juz.number,
      startAyahNumber: juz.start,
      endAyahNumber: juz.end,
    })),
  );

  await db.insert(schema.hizbs).values(
    hizbsCsv.map((row) => ({
      uci: uci('QH', Number(row.number)),
      number: Number(row.number),
      juzUci: uci('QJ', idNumber(row.juz)),
      numberInJuz: Number(row.number_in_juz),
    })),
  );

  const rubHizb = new Map<number, number>();
  const rubRanges: Range[] = rubsCsv.map((row) => {
    const number = Number(row.number);
    rubHizb.set(number, idNumber(row.hizb));
    return {
      number,
      start: idNumber(row.start_aya),
      end: idNumber(row.end_aya),
    };
  });
  await db.insert(schema.rubs).values(
    rubsCsv.map((row) => ({
      uci: uci('QR', Number(row.number)),
      number: Number(row.number),
      hizbUci: uci('QH', idNumber(row.hizb)),
      numberInHizb: Number(row.number_in_hizb),
      numberInJuz: Number(row.number_in_juz),
      startAyahNumber: idNumber(row.start_aya),
      endAyahNumber: idNumber(row.end_aya),
    })),
  );

  // rukus.csv ids reuse the QJ prefix (a collision with juzs); the ruku UCI
  // is rebuilt from the row's own number with the QK prefix instead.
  const rukuRanges: Range[] = rukusCsv.map((row) => ({
    number: Number(row.number),
    start: idNumber(row.start_aya),
    end: idNumber(row.end_aya),
  }));
  await db.insert(schema.rukus).values(
    rukusCsv.map((row) => ({
      uci: uci('QK', Number(row.number)),
      number: Number(row.number),
      surahUci: uci('QS', idNumber(row.sura)),
      numberInSurah: Number(row.number_in_sura),
      juzUci: uci('QJ', idNumber(row.juz)),
      numberInJuz: Number(row.number_in_juz),
      startAyahNumber: idNumber(row.start_aya),
      endAyahNumber: idNumber(row.end_aya),
      ayahCount: Number(row.total_ayas),
    })),
  );

  const surahManzil = new Map<number, number>();
  for (const row of manzilsCsv) {
    for (let s = idNumber(row.start_sura); s <= idNumber(row.end_sura); s++) {
      surahManzil.set(s, Number(row.number));
    }
  }
  await db.insert(schema.manzils).values(
    manzilsCsv.map((row) => ({
      uci: uci('QM', Number(row.number)),
      number: Number(row.number),
      startSurahUci: uci('QS', idNumber(row.start_sura)),
      endSurahUci: uci('QS', idNumber(row.end_sura)),
    })),
  );

  const juzOf = rangeLookup(juzRanges, 'juz');
  const rubOf = rangeLookup(rubRanges, 'rub');
  const rukuOf = rangeLookup(rukuRanges, 'ruku');

  const ayahRows = ayasCsv.map((row) => {
    const number = idNumber(row.id);
    const surahNumber = idNumber(row.sura);
    const manzilNumber = surahManzil.get(surahNumber);
    if (!manzilNumber) throw new Error(`No manzil for surah ${surahNumber}`);
    if (row.sajda && !['recommended', 'obligatory'].includes(row.sajda)) {
      throw new Error(`Unexpected sajda value: ${row.sajda}`);
    }
    const rubNumber = rubOf(number);
    const hizbNumber = rubHizb.get(rubNumber);
    if (!hizbNumber) throw new Error(`No hizb for rub ${rubNumber}`);
    return {
      uci: uci('QA', number),
      number,
      surahUci: uci('QS', surahNumber),
      numberInSurah: Number(row.number_in_sura),
      sajda: (row.sajda || null) as 'recommended' | 'obligatory' | null,
      juzUci: uci('QJ', juzOf(number)),
      hizbUci: uci('QH', hizbNumber),
      rubUci: uci('QR', rubNumber),
      rukuUci: uci('QK', rukuOf(number)),
      manzilUci: uci('QM', manzilNumber),
    };
  });
  for (let i = 0; i < ayahRows.length; i += CHUNK_SIZE) {
    await db.insert(schema.ayahs).values(ayahRows.slice(i, i + CHUNK_SIZE));
  }

  await db.insert(schema.editions).values({
    uci: EDITION_UCI,
    number: EDITION_NUMBER,
    slug: EDITION_SLUG,
    name: 'Quran Simple (Tanzil)',
    language: 'ar',
    type: 'original',
  });

  const textRows = ayasCsv.map((row) => {
    const surahNumber = idNumber(row.sura);
    const ayahNumber = idNumber(row.id);
    const isFirstAyah = Number(row.number_in_sura) === 1;
    return {
      uci: ayahTextUci(EDITION_NUMBER, ayahNumber),
      ayahUci: uci('QA', ayahNumber),
      editionUci: EDITION_UCI,
      text: row.text,
      bismillah:
        isFirstAyah && bismillahs.has(surahNumber)
          ? bismillahs.get(surahNumber)
          : null,
    };
  });
  for (let i = 0; i < textRows.length; i += CHUNK_SIZE) {
    await db.insert(schema.ayahTexts).values(textRows.slice(i, i + CHUNK_SIZE));
  }

  // Translation editions: matched by the sura:aya pair in each line, not by
  // line order, so a misaligned file fails loudly instead of shifting texts.
  for (const translation of TRANSLATIONS) {
    const texts = readTranslation(translation.file);
    await db.insert(schema.editions).values({
      uci: uci('QE', translation.number),
      number: translation.number,
      slug: translation.slug,
      name: translation.name,
      language: translation.language,
      type: 'translation',
    });
    // The edition's rendering of 1:1 is its bismillah wording; translations
    // carry no per-surah variants, so it applies to all prefixed surahs.
    const bismillahText = texts.get('1:1');
    if (!bismillahText) throw new Error(`${translation.file}: missing 1:1`);
    const translationRows = ayasCsv.map((row) => {
      const ayahNumber = idNumber(row.id);
      const surahNumber = idNumber(row.sura);
      const key = `${surahNumber}:${Number(row.number_in_sura)}`;
      const text = texts.get(key);
      if (!text) throw new Error(`${translation.file}: no text for ${key}`);
      const hasBismillah =
        Number(row.number_in_sura) === 1 &&
        surahNumber !== 1 &&
        surahNumber !== 9;
      return {
        uci: ayahTextUci(translation.number, ayahNumber),
        ayahUci: uci('QA', ayahNumber),
        editionUci: uci('QE', translation.number),
        text,
        bismillah: hasBismillah ? bismillahText : null,
      };
    });
    if (translationRows.length !== texts.size) {
      throw new Error(
        `${translation.file}: ${texts.size} lines for ${translationRows.length} ayahs`,
      );
    }
    for (let i = 0; i < translationRows.length; i += CHUNK_SIZE) {
      await db
        .insert(schema.ayahTexts)
        .values(translationRows.slice(i, i + CHUNK_SIZE));
    }
    console.log(`Seeded translation ${translation.slug} (${texts.size} ayahs).`);
  }

  console.log(
    `Seeded ${surasCsv.length} surahs, ${ayasCsv.length} ayahs, ` +
      `${juzsCsv.length} juzs, ${hizbsCsv.length} hizbs, ${rubsCsv.length} rubs, ` +
      `${rukusCsv.length} rukus, ${manzilsCsv.length} manzils, ` +
      `${textRows.length} ayah texts (${EDITION_SLUG}).`,
  );
  await pool.end();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
