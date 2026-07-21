import { Module } from '@nestjs/common';
import { AyahsModule } from '../ayahs/ayahs.module';
import { DivisionsController } from './divisions.controller';
import { DivisionsService } from './divisions.service';

@Module({
  imports: [AyahsModule],
  controllers: [DivisionsController],
  providers: [DivisionsService],
})
export class DivisionsModule {}
