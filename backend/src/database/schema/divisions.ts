import { sql } from 'drizzle-orm';
import {
  check,
  integer,
  pgTable,
  smallint,
  text,
  unique,
} from 'drizzle-orm/pg-core';
import { surahs } from './surahs';

/**
 * Reading divisions of the Quran. Juz, rub, and ruku are defined as ranges
 * over the global ayah number (1..6236); hizb and manzil are defined by their
 * parent juz / surah range. Range columns are plain integers (no FK to ayahs)
 * because ayahs also reference these tables — the seed guarantees integrity.
 */

export const juzs = pgTable(
  'juzs',
  {
    uci: text('uci').primaryKey(),
    number: smallint('number').notNull().unique(),
    startAyahNumber: integer('start_ayah_number').notNull(),
    endAyahNumber: integer('end_ayah_number').notNull(),
  },
  (t) => [
    check('juzs_uci_format', sql`${t.uci} = 'QJ' || ${t.number}::text`),
    check('juzs_number_range', sql`${t.number} BETWEEN 1 AND 30`),
    check(
      'juzs_ayah_range',
      sql`${t.startAyahNumber} <= ${t.endAyahNumber}`,
    ),
  ],
);

export const hizbs = pgTable(
  'hizbs',
  {
    uci: text('uci').primaryKey(),
    number: smallint('number').notNull().unique(),
    juzUci: text('juz_uci')
      .notNull()
      .references(() => juzs.uci),
    numberInJuz: smallint('number_in_juz').notNull(),
  },
  (t) => [
    unique('hizbs_juz_position').on(t.juzUci, t.numberInJuz),
    check('hizbs_uci_format', sql`${t.uci} = 'QH' || ${t.number}::text`),
    check('hizbs_number_range', sql`${t.number} BETWEEN 1 AND 60`),
  ],
);

export const rubs = pgTable(
  'rubs',
  {
    uci: text('uci').primaryKey(),
    number: smallint('number').notNull().unique(),
    hizbUci: text('hizb_uci')
      .notNull()
      .references(() => hizbs.uci),
    numberInHizb: smallint('number_in_hizb').notNull(),
    numberInJuz: smallint('number_in_juz').notNull(),
    startAyahNumber: integer('start_ayah_number').notNull(),
    endAyahNumber: integer('end_ayah_number').notNull(),
  },
  (t) => [
    unique('rubs_hizb_position').on(t.hizbUci, t.numberInHizb),
    check('rubs_uci_format', sql`${t.uci} = 'QR' || ${t.number}::text`),
    check('rubs_number_range', sql`${t.number} BETWEEN 1 AND 240`),
    check(
      'rubs_ayah_range',
      sql`${t.startAyahNumber} <= ${t.endAyahNumber}`,
    ),
  ],
);

export const rukus = pgTable(
  'rukus',
  {
    uci: text('uci').primaryKey(),
    number: smallint('number').notNull().unique(),
    surahUci: text('surah_uci')
      .notNull()
      .references(() => surahs.uci),
    numberInSurah: smallint('number_in_surah').notNull(),
    juzUci: text('juz_uci')
      .notNull()
      .references(() => juzs.uci),
    numberInJuz: smallint('number_in_juz').notNull(),
    startAyahNumber: integer('start_ayah_number').notNull(),
    endAyahNumber: integer('end_ayah_number').notNull(),
    ayahCount: smallint('ayah_count').notNull(),
  },
  (t) => [
    unique('rukus_surah_position').on(t.surahUci, t.numberInSurah),
    check('rukus_uci_format', sql`${t.uci} = 'QK' || ${t.number}::text`),
    check('rukus_number_range', sql`${t.number} BETWEEN 1 AND 556`),
    check(
      'rukus_ayah_range',
      sql`${t.startAyahNumber} <= ${t.endAyahNumber}`,
    ),
  ],
);

export const manzils = pgTable(
  'manzils',
  {
    uci: text('uci').primaryKey(),
    number: smallint('number').notNull().unique(),
    startSurahUci: text('start_surah_uci')
      .notNull()
      .references(() => surahs.uci),
    endSurahUci: text('end_surah_uci')
      .notNull()
      .references(() => surahs.uci),
  },
  (t) => [
    check('manzils_uci_format', sql`${t.uci} = 'QM' || ${t.number}::text`),
    check('manzils_number_range', sql`${t.number} BETWEEN 1 AND 7`),
  ],
);

export type Juz = typeof juzs.$inferSelect;
export type Hizb = typeof hizbs.$inferSelect;
export type Rub = typeof rubs.$inferSelect;
export type Ruku = typeof rukus.$inferSelect;
export type Manzil = typeof manzils.$inferSelect;
