import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/** One edition's rendering of an ayah, embedded in the ayah response. */
export const ayahTextEntrySchema = z.object({
  edition: z.string().describe('Edition slug (e.g. quran-simple)'),
  name: z.string().describe('Edition display name'),
  language: z.string().describe('Edition language code'),
  type: z
    .enum(['original', 'translation', 'transliteration'])
    .describe('Kind of text rendering'),
  text: z.string().describe('The ayah text in this edition'),
  bismillah: z
    .string()
    .nullable()
    .describe('Bismillah header, only on the first ayah of qualifying surahs'),
});

/** Ayah with its text in one or more requested editions. */
export const ayahWithTextSchema = z.object({
  uci: z.string().describe("Unique Content Identifier, 'QA' + number (e.g. QA262)"),
  number: z.number().int().describe('Global ayah number, 1–6236'),
  surahUci: z.string().describe('UCI of the surah this ayah belongs to'),
  numberInSurah: z.number().int().describe('Position within the surah'),
  sajda: z
    .enum(['recommended', 'obligatory'])
    .nullable()
    .describe('Type of prostration, null if none'),
  juzUci: z.string().describe('UCI of the containing juz'),
  hizbUci: z.string().describe('UCI of the containing hizb'),
  rubUci: z.string().describe('UCI of the containing rub'),
  rukuUci: z.string().describe('UCI of the containing ruku'),
  manzilUci: z.string().describe('UCI of the containing manzil'),
  texts: z
    .array(ayahTextEntrySchema)
    .describe('Renderings in the requested editions, in requested order'),
});

export class AyahTextEntryDto extends createZodDto(ayahTextEntrySchema) {}
export class AyahWithTextDto extends createZodDto(ayahWithTextSchema) {}
