import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AyahsService } from './ayahs.service';
import { AyahWithTextDto } from './dto/ayah.dto';
import { EditionQueryDto } from './dto/edition-query.dto';

@ApiTags('Ayahs')
@Controller('ayahs')
export class AyahsController {
  constructor(private readonly ayahs: AyahsService) {}

  @Get(':identifier')
  @ApiOperation({
    summary: 'Get an ayah',
    description: 'Fetch a single ayah with text in the requested editions.',
  })
  @ApiParam({
    name: 'identifier',
    description:
      "Global ayah number (e.g. 262), UCI (e.g. QA262), or 'surah:ayah' (e.g. 2:255)",
    example: '2:255',
  })
  @ApiOkResponse({ type: AyahWithTextDto })
  @ApiNotFoundResponse({ description: 'No ayah matches the identifier, or an edition is unknown' })
  findOne(
    @Param('identifier') identifier: string,
    @Query() query: EditionQueryDto,
  ) {
    return this.ayahs.findOne(identifier, query.edition);
  }
}
