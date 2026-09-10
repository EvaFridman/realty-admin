import { Controller, Query, ParseIntPipe, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { DistrictsService } from './districts.service.js';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';
import { ListDistrictsDto } from './dto/list-districts.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { District } from './districts.types.js';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) { }

  @Roles("moderator")
  @Post()
  async create(@Body() dto: CreateDistrictDto): Promise<District> {
    return await this.districtsService.create(dto);
  }

  @Get()
  async findAll(@Query() query: ListDistrictsDto) {
    const { page, limit, city } = query;
    return await this.districtsService.findAll(page, limit, city);
  }

  @Get('count')
  async count(): Promise<number> {
    return await this.districtsService.count();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<District> {
    return await this.districtsService.findOne(id);
  }

  @Patch(':id/status')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDistrictDto): Promise<District> {
    return await this.districtsService.update(id, dto);
  }
}