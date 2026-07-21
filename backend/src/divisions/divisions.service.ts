import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, type SQL } from 'drizzle-orm';
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { DRIZZLE } from '../database/drizzle.constants';
import { DrizzleDB } from '../database/database.module';
import { ayahs, hizbs, juzs, manzils, rubs, rukus } from '../database/schema';
import { AyahsService, type AyahWithText } from '../ayahs/ayahs.service';

/** A reading division and how to query it. */
interface DivisionDescriptor {
  label: string;
  table: PgTable;
  numberColumn: PgColumn;
  uciColumn: PgColumn;
  /** The ayahs column denormalizing membership in this division. */
  ayahColumn: PgColumn;
}

/** Route segment -> division. The single source of truth for all five kinds. */
const DIVISIONS = {
  juzs: {
    label: 'Juz',
    table: juzs,
    numberColumn: juzs.number,
    uciColumn: juzs.uci,
    ayahColumn: ayahs.juzUci,
  },
  hizbs: {
    label: 'Hizb',
    table: hizbs,
    numberColumn: hizbs.number,
    uciColumn: hizbs.uci,
    ayahColumn: ayahs.hizbUci,
  },
  rubs: {
    label: 'Rub',
    table: rubs,
    numberColumn: rubs.number,
    uciColumn: rubs.uci,
    ayahColumn: ayahs.rubUci,
  },
  rukus: {
    label: 'Ruku',
    table: rukus,
    numberColumn: rukus.number,
    uciColumn: rukus.uci,
    ayahColumn: ayahs.rukuUci,
  },
  manzils: {
    label: 'Manzil',
    table: manzils,
    numberColumn: manzils.number,
    uciColumn: manzils.uci,
    ayahColumn: ayahs.manzilUci,
  },
} satisfies Record<string, DivisionDescriptor>;

export type DivisionKind = keyof typeof DIVISIONS;

@Injectable()
export class DivisionsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly ayahs: AyahsService,
  ) {}

  list(kind: DivisionKind): Promise<unknown[]> {
    const d = DIVISIONS[kind];
    return this.db.select().from(d.table).orderBy(d.numberColumn);
  }

  /** Look up one division by number or UCI. 404 if absent. */
  async findOne(kind: DivisionKind, identifier: string): Promise<Record<string, unknown>> {
    const d = DIVISIONS[kind];
    const where: SQL = /^\d+$/.test(identifier)
      ? eq(d.numberColumn, Number(identifier))
      : eq(d.uciColumn, identifier.toUpperCase());
    const [row] = await this.db.select().from(d.table).where(where);
    if (!row) {
      throw new NotFoundException(`${d.label} ${identifier} not found`);
    }
    return row as Record<string, unknown>;
  }

  /** All ayahs of a division, in Quran order, with edition text. */
  async findAyahs(
    kind: DivisionKind,
    identifier: string,
    editionParam?: string,
  ): Promise<AyahWithText[]> {
    const division = await this.findOne(kind, identifier);
    const d = DIVISIONS[kind];
    return this.ayahs.findByDivision(d.ayahColumn, division.uci as string, editionParam);
  }
}
