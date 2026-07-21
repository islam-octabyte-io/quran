import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/** Response shape for the health check. */
export class HealthDto extends createZodDto(
  z.object({
    status: z.enum(['ok', 'error']).describe('Overall service status'),
    db: z.enum(['up', 'down']).describe('Database connectivity'),
  }),
) {}
