import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { SurahsModule } from './surahs/surahs.module';
import { EditionsModule } from './editions/editions.module';
import { AyahsModule } from './ayahs/ayahs.module';
import { DivisionsModule } from './divisions/divisions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    DatabaseModule,
    HealthModule,
    SurahsModule,
    EditionsModule,
    AyahsModule,
    DivisionsModule,
  ],
})
export class AppModule {}
