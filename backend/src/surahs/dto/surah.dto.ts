import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Response shape for a surah, mirroring the `surahs` table `$inferSelect` type.
 * Output-only: used for OpenAPI response docs, not request validation.
 */
export class SurahDto extends createZodDto(
  z.object({
    uci: z.string().describe("Unique Content Identifier, 'QS' + number (e.g. QS2)"),
    number: z.number().int().describe('Surah number, 1–114'),
    nameArabic: z.string().describe('Arabic name (e.g. البقرة)'),
    nameEnglish: z.string().describe('English name (e.g. Al-Baqara)'),
    revelationPlace: z
      .enum(['meccan', 'medinan'])
      .describe('Where the surah was revealed'),
    revelationOrder: z.number().int().describe('Chronological order of revelation'),
    ayahCount: z.number().int().describe('Number of ayahs in the surah'),
    rukuCount: z.number().int().describe('Number of rukus in the surah'),
    bismillahPrefix: z
      .boolean()
      .describe('True when a bismillah header precedes the surah'),
  }),
) {}
