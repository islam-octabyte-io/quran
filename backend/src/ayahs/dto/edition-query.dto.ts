import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * `?edition=` selects the text editions to include. Comma-separated slugs pick
 * several (e.g. `?edition=quran-simple,ur-kanzuliman`); omitted, the default
 * edition is used. Validated by the global ZodValidationPipe, and expanded into
 * a Swagger query param automatically by nestjs-zod's OpenAPI metadata.
 */
export class EditionQueryDto extends createZodDto(
  z.object({
    edition: z
      .string()
      .describe(
        'Comma-separated edition slugs, numbers, or UCIs (default: quran-simple)',
      )
      .optional(),
  }),
) {}
