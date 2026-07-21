import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/** Response shape for an edition, mirroring the `editions` table. */
export class EditionDto extends createZodDto(
  z.object({
    uci: z.string().describe("Unique Content Identifier, 'QE' + number (e.g. QE1)"),
    number: z.number().int().describe('Edition number'),
    slug: z.string().describe('Stable handle for lookups (e.g. quran-simple)'),
    name: z.string().describe('Edition display name'),
    language: z.string().describe('Edition language code'),
    type: z
      .enum(['original', 'translation', 'transliteration'])
      .describe('Kind of text rendering'),
  }),
) {}
