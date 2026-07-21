import { sql } from 'drizzle-orm';
import { boolean, check, pgTable, smallint, text } from 'drizzle-orm/pg-core';
import { revelationPlaceEnum } from './enums';

/**
 * UCI (Unique Content Identifier) prefix registry:
 *   QS surah · QA ayah · QJ juz · QH hizb · QR rub · QK ruku · QM manzil
 *   QE edition · QT ayah text (edition number + ayah number padded to 4)
 * First letter = corpus (Q = Quran), second = entity type, then the number.
 */
export const surahs = pgTable(
  'surahs',
  {
    uci: text('uci').primaryKey(),
    number: smallint('number').notNull().unique(),
    nameArabic: text('name_arabic').notNull(),
    nameEnglish: text('name_english').notNull(),
    revelationPlace: revelationPlaceEnum('revelation_place').notNull(),
    revelationOrder: smallint('revelation_order').notNull(),
    ayahCount: smallint('ayah_count').notNull(),
    rukuCount: smallint('ruku_count').notNull(),
    // True when a bismillah header precedes the surah. False for surah 9
    // (At-Tawbah) and surah 1, where the bismillah is ayah 1 itself.
    bismillahPrefix: boolean('bismillah_prefix').notNull(),
  },
  (t) => [
    check('surahs_uci_format', sql`${t.uci} = 'QS' || ${t.number}::text`),
    check('surahs_number_range', sql`${t.number} BETWEEN 1 AND 114`),
  ],
);

export type Surah = typeof surahs.$inferSelect;
export type NewSurah = typeof surahs.$inferInsert;
