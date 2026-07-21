import { Module } from '@nestjs/common';
import { EditionsModule } from '../editions/editions.module';
import { AyahsController } from './ayahs.controller';
import { AyahsService } from './ayahs.service';

@Module({
  imports: [EditionsModule],
  controllers: [AyahsController],
  providers: [AyahsService],
  exports: [AyahsService],
})
export class AyahsModule {}
