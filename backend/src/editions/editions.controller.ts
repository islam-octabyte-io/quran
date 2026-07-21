import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { EditionsService } from './editions.service';
import { EditionDto } from './dto/edition.dto';
import { ListEditionsQueryDto } from './dto/list-editions-query.dto';

@ApiTags('Editions')
@Controller('editions')
export class EditionsController {
  constructor(private readonly editions: EditionsService) {}

  @Get()
  @ApiOperation({
    summary: 'List editions',
    description: 'All editions, optionally filtered by language and/or type.',
  })
  @ApiOkResponse({ type: EditionDto, isArray: true })
  findAll(@Query() query: ListEditionsQueryDto) {
    return this.editions.findAll({
      language: query.language,
      type: query.type,
    });
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get an edition by slug, number, or UCI' })
  @ApiParam({
    name: 'identifier',
    description: 'Edition slug (e.g. quran-simple), number (e.g. 1), or UCI (e.g. QE1)',
    example: 'quran-simple',
  })
  @ApiOkResponse({ type: EditionDto })
  @ApiNotFoundResponse({ description: 'No edition matches the identifier' })
  findOne(@Param('identifier') identifier: string) {
    return this.editions.findOne(identifier);
  }
}
