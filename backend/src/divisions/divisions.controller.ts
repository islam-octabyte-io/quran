import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AyahWithTextDto } from '../ayahs/dto/ayah.dto';
import { EditionQueryDto } from '../ayahs/dto/edition-query.dto';
import { DivisionsService } from './divisions.service';
import { HizbDto, JuzDto, ManzilDto, RubDto, RukuDto } from './dto/division.dto';

// Shared @ApiParam for every division detail/ayahs route.
const identifierParam = (kind: string, example: string) =>
  ApiParam({
    name: 'identifier',
    description: `${kind} number (e.g. ${example}) or UCI`,
    example,
  });

/**
 * Read routes for all five reading divisions. Each kind gets the same trio:
 * list, detail (by number or UCI), and its ayahs (with `?edition=`).
 */
@ApiTags('Divisions')
@Controller()
export class DivisionsController {
  constructor(private readonly divisions: DivisionsService) {}

  // Juzs
  @Get('juzs')
  @ApiOperation({ summary: 'List all juzs' })
  @ApiOkResponse({ type: JuzDto, isArray: true })
  listJuzs() {
    return this.divisions.list('juzs');
  }

  @Get('juzs/:identifier')
  @ApiOperation({ summary: 'Get a juz by number or UCI' })
  @identifierParam('Juz', '1')
  @ApiOkResponse({ type: JuzDto })
  @ApiNotFoundResponse({ description: 'No juz matches the identifier' })
  getJuz(@Param('identifier') identifier: string) {
    return this.divisions.findOne('juzs', identifier);
  }

  @Get('juzs/:identifier/ayahs')
  @ApiOperation({ summary: 'Get the ayahs of a juz' })
  @identifierParam('Juz', '1')
  @ApiOkResponse({ type: AyahWithTextDto, isArray: true })
  @ApiNotFoundResponse({ description: 'No juz matches the identifier, or an edition is unknown' })
  juzAyahs(@Param('identifier') identifier: string, @Query() query: EditionQueryDto) {
    return this.divisions.findAyahs('juzs', identifier, query.edition);
  }

  // Hizbs
  @Get('hizbs')
  @ApiOperation({ summary: 'List all hizbs' })
  @ApiOkResponse({ type: HizbDto, isArray: true })
  listHizbs() {
    return this.divisions.list('hizbs');
  }

  @Get('hizbs/:identifier')
  @ApiOperation({ summary: 'Get a hizb by number or UCI' })
  @identifierParam('Hizb', '1')
  @ApiOkResponse({ type: HizbDto })
  @ApiNotFoundResponse({ description: 'No hizb matches the identifier' })
  getHizb(@Param('identifier') identifier: string) {
    return this.divisions.findOne('hizbs', identifier);
  }

  @Get('hizbs/:identifier/ayahs')
  @ApiOperation({ summary: 'Get the ayahs of a hizb' })
  @identifierParam('Hizb', '1')
  @ApiOkResponse({ type: AyahWithTextDto, isArray: true })
  @ApiNotFoundResponse({ description: 'No hizb matches the identifier, or an edition is unknown' })
  hizbAyahs(@Param('identifier') identifier: string, @Query() query: EditionQueryDto) {
    return this.divisions.findAyahs('hizbs', identifier, query.edition);
  }

  // Rubs
  @Get('rubs')
  @ApiOperation({ summary: 'List all rubs' })
  @ApiOkResponse({ type: RubDto, isArray: true })
  listRubs() {
    return this.divisions.list('rubs');
  }

  @Get('rubs/:identifier')
  @ApiOperation({ summary: 'Get a rub by number or UCI' })
  @identifierParam('Rub', '1')
  @ApiOkResponse({ type: RubDto })
  @ApiNotFoundResponse({ description: 'No rub matches the identifier' })
  getRub(@Param('identifier') identifier: string) {
    return this.divisions.findOne('rubs', identifier);
  }

  @Get('rubs/:identifier/ayahs')
  @ApiOperation({ summary: 'Get the ayahs of a rub' })
  @identifierParam('Rub', '1')
  @ApiOkResponse({ type: AyahWithTextDto, isArray: true })
  @ApiNotFoundResponse({ description: 'No rub matches the identifier, or an edition is unknown' })
  rubAyahs(@Param('identifier') identifier: string, @Query() query: EditionQueryDto) {
    return this.divisions.findAyahs('rubs', identifier, query.edition);
  }

  // Rukus
  @Get('rukus')
  @ApiOperation({ summary: 'List all rukus' })
  @ApiOkResponse({ type: RukuDto, isArray: true })
  listRukus() {
    return this.divisions.list('rukus');
  }

  @Get('rukus/:identifier')
  @ApiOperation({ summary: 'Get a ruku by number or UCI' })
  @identifierParam('Ruku', '1')
  @ApiOkResponse({ type: RukuDto })
  @ApiNotFoundResponse({ description: 'No ruku matches the identifier' })
  getRuku(@Param('identifier') identifier: string) {
    return this.divisions.findOne('rukus', identifier);
  }

  @Get('rukus/:identifier/ayahs')
  @ApiOperation({ summary: 'Get the ayahs of a ruku' })
  @identifierParam('Ruku', '1')
  @ApiOkResponse({ type: AyahWithTextDto, isArray: true })
  @ApiNotFoundResponse({ description: 'No ruku matches the identifier, or an edition is unknown' })
  rukuAyahs(@Param('identifier') identifier: string, @Query() query: EditionQueryDto) {
    return this.divisions.findAyahs('rukus', identifier, query.edition);
  }

  // Manzils
  @Get('manzils')
  @ApiOperation({ summary: 'List all manzils' })
  @ApiOkResponse({ type: ManzilDto, isArray: true })
  listManzils() {
    return this.divisions.list('manzils');
  }

  @Get('manzils/:identifier')
  @ApiOperation({ summary: 'Get a manzil by number or UCI' })
  @identifierParam('Manzil', '1')
  @ApiOkResponse({ type: ManzilDto })
  @ApiNotFoundResponse({ description: 'No manzil matches the identifier' })
  getManzil(@Param('identifier') identifier: string) {
    return this.divisions.findOne('manzils', identifier);
  }

  @Get('manzils/:identifier/ayahs')
  @ApiOperation({ summary: 'Get the ayahs of a manzil' })
  @identifierParam('Manzil', '1')
  @ApiOkResponse({ type: AyahWithTextDto, isArray: true })
  @ApiNotFoundResponse({ description: 'No manzil matches the identifier, or an edition is unknown' })
  manzilAyahs(@Param('identifier') identifier: string, @Query() query: EditionQueryDto) {
    return this.divisions.findAyahs('manzils', identifier, query.edition);
  }
}
