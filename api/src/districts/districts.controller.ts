import { Controller, Query, ParseIntPipe, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DistrictsService } from './districts.service.js';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';
import { ListDistrictsDto } from './dto/list-districts.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js'; 

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Roles("moderator")
  @Post()
  create(@Body() dto: CreateDistrictDto) {
    return this.districtsService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListDistrictsDto) {
    const { page, limit, city } = query;
    return this.districtsService.findAll(page, limit, city);
  }

  @Get('count')
  count() {
    return this.districtsService.count();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.districtsService.findOne(id);
  }

  @Roles("moderator")
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDistrictDto) {
    return this.districtsService.update(id, dto);
  }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.districtsService.remove(id);
  // }
}
