import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Response shapes for the five reading divisions, mirroring the division tables.
 * Each kind has its own columns, so each gets its own DTO.
 */

export class JuzDto extends createZodDto(
  z.object({
    uci: z.string().describe("UCI, 'QJ' + number (e.g. QJ1)"),
    number: z.number().int().describe('Juz number, 1–30'),
    startAyahNumber: z.number().int().describe('First global ayah number'),
    endAyahNumber: z.number().int().describe('Last global ayah number'),
  }),
) {}

export class HizbDto extends createZodDto(
  z.object({
    uci: z.string().describe("UCI, 'QH' + number (e.g. QH1)"),
    number: z.number().int().describe('Hizb number, 1–60'),
    juzUci: z.string().describe('UCI of the containing juz'),
    numberInJuz: z.number().int().describe('Position within the juz'),
  }),
) {}

export class RubDto extends createZodDto(
  z.object({
    uci: z.string().describe("UCI, 'QR' + number (e.g. QR1)"),
    number: z.number().int().describe('Rub number, 1–240'),
    hizbUci: z.string().describe('UCI of the containing hizb'),
    numberInHizb: z.number().int().describe('Position within the hizb'),
    numberInJuz: z.number().int().describe('Position within the juz'),
    startAyahNumber: z.number().int().describe('First global ayah number'),
    endAyahNumber: z.number().int().describe('Last global ayah number'),
  }),
) {}

export class RukuDto extends createZodDto(
  z.object({
    uci: z.string().describe("UCI, 'QK' + number (e.g. QK1)"),
    number: z.number().int().describe('Ruku number, 1–556'),
    surahUci: z.string().describe('UCI of the containing surah'),
    numberInSurah: z.number().int().describe('Position within the surah'),
    juzUci: z.string().describe('UCI of the containing juz'),
    numberInJuz: z.number().int().describe('Position within the juz'),
    startAyahNumber: z.number().int().describe('First global ayah number'),
    endAyahNumber: z.number().int().describe('Last global ayah number'),
    ayahCount: z.number().int().describe('Number of ayahs in the ruku'),
  }),
) {}

export class ManzilDto extends createZodDto(
  z.object({
    uci: z.string().describe("UCI, 'QM' + number (e.g. QM1)"),
    number: z.number().int().describe('Manzil number, 1–7'),
    startSurahUci: z.string().describe('UCI of the first surah'),
    endSurahUci: z.string().describe('UCI of the last surah'),
  }),
) {}
