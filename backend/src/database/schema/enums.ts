import { pgEnum } from 'drizzle-orm/pg-core';

export const revelationPlaceEnum = pgEnum('revelation_place', [
  'meccan',
  'medinan',
]);

export const sajdaTypeEnum = pgEnum('sajda_type', [
  'recommended',
  'obligatory',
]);

export const editionTypeEnum = pgEnum('edition_type', [
  'original',
  'translation',
  'transliteration',
]);
