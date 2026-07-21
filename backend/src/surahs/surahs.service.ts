import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../database/drizzle.constants';
import { DrizzleDB } from '../database/database.module';
import { surahs, type Surah } from '../database/schema';

@Injectable()
export class SurahsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAll(): Promise<Surah[]> {
    return this.db.select().from(surahs).orderBy(surahs.number);
  }

  /** Look up a surah by UCI ('QS2') or number ('2'). */
  async findOne(identifier: string): Promise<Surah> {
    const where = /^\d+$/.test(identifier)
      ? eq(surahs.number, Number(identifier))
      : eq(surahs.uci, identifier.toUpperCase());
    const [surah] = await this.db.select().from(surahs).where(where);
    if (!surah) {
      throw new NotFoundException(`Surah ${identifier} not found`);
    }
    return surah;
  }
}
