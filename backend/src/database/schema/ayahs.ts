import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  smallint,
  text,
  unique,
} from 'drizzle-orm/pg-core';
import { hizbs, juzs, manzils, rubs, rukus } from './divisions';
import { sajdaTypeEnum } from './enums';
import { surahs } from './surahs';

/**
 * One row per ayah, keyed by UCI ('QA' + global number 1..6236). Division
 * membership is denormalized here (derived from the division range tables at
 * seed time) so "all ayahs of juz 5" is a single indexed WHERE. The ayah text
 * itself lives in ayah_texts, keyed by edition.
 */
export const ayahs = pgTable(
  'ayahs',
  {
    uci: text('uci').primaryKey(),
    number: integer('number').notNull().unique(),
    surahUci: text('surah_uci')
      .notNull()
      .references(() => surahs.uci),
    numberInSurah: smallint('number_in_surah').notNull(),
    sajda: sajdaTypeEnum('sajda'),
    juzUci: text('juz_uci')
      .notNull()
      .references(() => juzs.uci),
    hizbUci: text('hizb_uci')
      .notNull()
      .references(() => hizbs.uci),
    rubUci: text('rub_uci')
      .notNull()
      .references(() => rubs.uci),
    rukuUci: text('ruku_uci')
      .notNull()
      .references(() => rukus.uci),
    manzilUci: text('manzil_uci')
      .notNull()
      .references(() => manzils.uci),
  },
  (t) => [
    unique('ayahs_surah_position').on(t.surahUci, t.numberInSurah),
    index('ayahs_juz_idx').on(t.juzUci),
    index('ayahs_hizb_idx').on(t.hizbUci),
    index('ayahs_rub_idx').on(t.rubUci),
    index('ayahs_ruku_idx').on(t.rukuUci),
    index('ayahs_manzil_idx').on(t.manzilUci),
    check('ayahs_uci_format', sql`${t.uci} = 'QA' || ${t.number}::text`),
    check('ayahs_number_range', sql`${t.number} BETWEEN 1 AND 6236`),
  ],
);

export type Ayah = typeof ayahs.$inferSelect;
export type NewAyah = typeof ayahs.$inferInsert;
