import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, inArray, type SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { DRIZZLE } from '../database/drizzle.constants';
import { DrizzleDB } from '../database/database.module';
import {
  ayahs,
  ayahTexts,
  type Ayah,
  type Edition,
} from '../database/schema';
import { EditionsService } from '../editions/editions.service';

/** One edition's rendering of an ayah, embedded in the ayah response. */
export interface AyahTextEntry {
  edition: string;
  name: string;
  language: string;
  type: Edition['type'];
  text: string;
  bismillah: string | null;
}

export type AyahWithText = Ayah & { texts: AyahTextEntry[] };

const DEFAULT_EDITION_SLUG = 'quran-simple';

@Injectable()
export class AyahsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly editions: EditionsService,
  ) {}

  /**
   * Resolve the `?edition=` query into editions (default: quran-simple).
   * Accepts comma-separated slugs/numbers/UCIs; an unknown one 404s.
   */
  async resolveEditions(param?: string): Promise<Edition[]> {
    const tokens = (param ?? DEFAULT_EDITION_SLUG)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const unique = [...new Set(tokens.length ? tokens : [DEFAULT_EDITION_SLUG])];
    return Promise.all(unique.map((token) => this.editions.findOne(token)));
  }

  /** Fetch a single ayah by global number ('262'), UCI ('QA262'), or 'surah:ayah' ('2:255'). */
  async findOne(identifier: string, editionParam?: string): Promise<AyahWithText> {
    let where: SQL;
    if (/^\d+$/.test(identifier)) {
      where = eq(ayahs.number, Number(identifier));
    } else if (/^QA\d+$/i.test(identifier)) {
      where = eq(ayahs.uci, identifier.toUpperCase());
    } else if (/^\d+:\d+$/.test(identifier)) {
      const [surah, numberInSurah] = identifier.split(':').map(Number);
      where = and(
        eq(ayahs.surahUci, `QS${surah}`),
        eq(ayahs.numberInSurah, numberInSurah),
      )!;
    } else {
      throw new NotFoundException(`Ayah ${identifier} not found`);
    }
    const [ayah] = await this.db.select().from(ayahs).where(where);
    if (!ayah) {
      throw new NotFoundException(`Ayah ${identifier} not found`);
    }
    const editions = await this.resolveEditions(editionParam);
    const [withText] = await this.attachText([ayah], editions);
    return withText;
  }

  /** All ayahs of a surah (identified by its UCI), in surah order. */
  async findBySurah(surahUci: string, editionParam?: string): Promise<AyahWithText[]> {
    const rows = await this.db
      .select()
      .from(ayahs)
      .where(eq(ayahs.surahUci, surahUci))
      .orderBy(ayahs.numberInSurah);
    const editions = await this.resolveEditions(editionParam);
    return this.attachText(rows, editions);
  }

  /** All ayahs belonging to a division, in Quran order. */
  async findByDivision(
    column: PgColumn,
    divisionUci: string,
    editionParam?: string,
  ): Promise<AyahWithText[]> {
    const rows = await this.db
      .select()
      .from(ayahs)
      .where(eq(column, divisionUci))
      .orderBy(ayahs.number);
    const editions = await this.resolveEditions(editionParam);
    return this.attachText(rows, editions);
  }

  /**
   * Join each ayah to its text in the requested editions. One query over
   * ayah_texts; the `texts[]` array preserves the requested edition order.
   */
  private async attachText(
    rows: Ayah[],
    editions: Edition[],
  ): Promise<AyahWithText[]> {
    if (rows.length === 0) {
      return [];
    }
    const texts = await this.db
      .select()
      .from(ayahTexts)
      .where(
        and(
          inArray(
            ayahTexts.ayahUci,
            rows.map((r) => r.uci),
          ),
          inArray(
            ayahTexts.editionUci,
            editions.map((e) => e.uci),
          ),
        ),
      );

    // ayahUci -> editionUci -> { text, bismillah }
    const byAyah = new Map<string, Map<string, { text: string; bismillah: string | null }>>();
    for (const t of texts) {
      let editionMap = byAyah.get(t.ayahUci);
      if (!editionMap) {
        editionMap = new Map();
        byAyah.set(t.ayahUci, editionMap);
      }
      editionMap.set(t.editionUci, { text: t.text, bismillah: t.bismillah });
    }

    return rows.map((ayah) => {
      const editionMap = byAyah.get(ayah.uci);
      const entries: AyahTextEntry[] = [];
      for (const edition of editions) {
        const hit = editionMap?.get(edition.uci);
        if (!hit) continue;
        entries.push({
          edition: edition.slug,
          name: edition.name,
          language: edition.language,
          type: edition.type,
          text: hit.text,
          bismillah: hit.bismillah,
        });
      }
      return { ...ayah, texts: entries };
    });
  }
}
