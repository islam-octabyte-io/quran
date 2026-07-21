import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AyahsService } from '../ayahs/ayahs.service';
import { AyahWithTextDto } from '../ayahs/dto/ayah.dto';
import { EditionQueryDto } from '../ayahs/dto/edition-query.dto';
import { SurahsService } from './surahs.service';
import { SurahDto } from './dto/surah.dto';

@ApiTags('Surahs')
@Controller('surahs')
export class SurahsController {
  constructor(
    private readonly surahs: SurahsService,
    private readonly ayahs: AyahsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all surahs', description: 'Returns all 114 surahs, ordered by number.' })
  @ApiOkResponse({ type: SurahDto, isArray: true })
  findAll() {
    return this.surahs.findAll();
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get a surah by number or UCI' })
  @ApiParam({
    name: 'identifier',
    description: 'Surah number (e.g. 2) or UCI (e.g. QS2)',
    example: '2',
  })
  @ApiOkResponse({ type: SurahDto })
  @ApiNotFoundResponse({ description: 'No surah matches the identifier' })
  findOne(@Param('identifier') identifier: string) {
    return this.surahs.findOne(identifier);
  }

  @Get(':identifier/ayahs')
  @ApiOperation({
    summary: 'Get the ayahs of a surah',
    description: 'Ayahs of the surah in order, each with text in the requested editions.',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Surah number (e.g. 2) or UCI (e.g. QS2)',
    example: '2',
  })
  @ApiOkResponse({ type: AyahWithTextDto, isArray: true })
  @ApiNotFoundResponse({ description: 'No surah matches the identifier, or an edition is unknown' })
  async findAyahs(
    @Param('identifier') identifier: string,
    @Query() query: EditionQueryDto,
  ) {
    // Resolve the surah first so a bad identifier 404s before the ayah lookup.
    const surah = await this.surahs.findOne(identifier);
    return this.ayahs.findBySurah(surah.uci, query.edition);
  }
}
