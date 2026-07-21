import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, type SQL } from 'drizzle-orm';
import { DRIZZLE } from '../database/drizzle.constants';
import { DrizzleDB } from '../database/database.module';
import { editions, type Edition } from '../database/schema';

/** Filters accepted by `findAll`. */
export interface EditionFilters {
  language?: string;
  type?: Edition['type'];
}

@Injectable()
export class EditionsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAll(filters: EditionFilters = {}): Promise<Edition[]> {
    const conditions: SQL[] = [];
    if (filters.language) {
      conditions.push(eq(editions.language, filters.language));
    }
    if (filters.type) {
      conditions.push(eq(editions.type, filters.type));
    }
    return this.db
      .select()
      .from(editions)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(editions.number);
  }

  /** Look up an edition by slug ('quran-simple'), number ('1'), or UCI ('QE1'). */
  async findOne(identifier: string): Promise<Edition> {
    let where: SQL;
    if (/^\d+$/.test(identifier)) {
      where = eq(editions.number, Number(identifier));
    } else if (/^QE\d+$/i.test(identifier)) {
      where = eq(editions.uci, identifier.toUpperCase());
    } else {
      where = eq(editions.slug, identifier);
    }
    const [edition] = await this.db.select().from(editions).where(where);
    if (!edition) {
      throw new NotFoundException(`Edition ${identifier} not found`);
    }
    return edition;
  }
}
