import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/** Optional filters for `GET /editions` (validated by the global ZodValidationPipe). */
export class ListEditionsQueryDto extends createZodDto(
  z.object({
    language: z
      .string()
      .describe('Filter by language code (e.g. en, ur)')
      .optional(),
    type: z
      .enum(['original', 'translation', 'transliteration'])
      .describe('Filter by edition type')
      .optional(),
  }),
) {}
