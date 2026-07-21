import { Module } from '@nestjs/common';
import { AyahsModule } from '../ayahs/ayahs.module';
import { SurahsController } from './surahs.controller';
import { SurahsService } from './surahs.service';

@Module({
  imports: [AyahsModule],
  controllers: [SurahsController],
  providers: [SurahsService],
})
export class SurahsModule {}
