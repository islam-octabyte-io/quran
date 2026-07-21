import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/drizzle.constants';
import { DrizzleDB } from '../database/database.module';
import { HealthDto } from './dto/health.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Reports service status and database connectivity (runs SELECT 1).',
  })
  @ApiOkResponse({ type: HealthDto })
  async check() {
    let db = 'down';
    try {
      await this.db.execute(sql`SELECT 1`);
      db = 'up';
    } catch {
      db = 'down';
    }
    return { status: db === 'up' ? 'ok' : 'error', db };
  }
}
