import { sql } from 'drizzle-orm';
import { check, pgTable, smallint, text, unique } from 'drizzle-orm/pg-core';
import { ayahs } from './ayahs';
import { editionTypeEnum } from './enums';

/**
 * An edition is one rendering of the text: an original Arabic script, a
 * translation, or a transliteration. Adding a new edition never touches the
 * structural tables — it is one editions row plus 6236 ayah_texts rows.
 */
export const editions = pgTable(
  'editions',
  {
    uci: text('uci').primaryKey(),
    number: smallint('number').notNull().unique(),
    // Stable human-readable handle for API lookups (?editions=quran-simple).
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    language: text('language').notNull(),
    type: editionTypeEnum('type').notNull(),
  },
  (t) => [
    check('editions_uci_format', sql`${t.uci} = 'QE' || ${t.number}::text`),
  ],
);

/**
 * Ayah-text UCI: 'QT' + edition number + ayah number zero-padded to 4 digits,
 * e.g. QT10001 = edition 1, ayah 1; QT10262 = edition 1, ayah 262. The last
 * four digits are always the ayah, so the format stays unique and parseable
 * no matter how many editions exist.
 */
export const ayahTexts = pgTable(
  'ayah_texts',
  {
    uci: text('uci').primaryKey(),
    ayahUci: text('ayah_uci')
      .notNull()
      .references(() => ayahs.uci),
    editionUci: text('edition_uci')
      .notNull()
      .references(() => editions.uci),
    text: text('text').notNull(),
    // Bismillah header preceding this ayah, set only on the first ayah of
    // surahs with bismillah_prefix = true. Kept per surah and per edition
    // because the wording varies (e.g. surahs 95 and 97 in Tanzil simple).
    bismillah: text('bismillah'),
  },
  (t) => [
    unique('ayah_texts_ayah_edition').on(t.ayahUci, t.editionUci),
    check(
      'ayah_texts_uci_format',
      sql`${t.uci} = 'QT' || substring(${t.editionUci} from 3) || lpad(substring(${t.ayahUci} from 3), 4, '0')`,
    ),
  ],
);

export type Edition = typeof editions.$inferSelect;
export type AyahText = typeof ayahTexts.$inferSelect;
