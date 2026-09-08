import { Controller, Query, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DistrictsService } from './districts.service.js';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post()
  create(@Body() dto: CreateDistrictDto) {
    return this.districtsService.create(dto);
  }

  @Get()
  findAll(@Query("page") page?: string, @Query("limit") limit?: string, @Query("city") city?: string) {
    const pageNumber = page ? +page : undefined;
    const limitNumber = limit ? +limit : undefined;
    return this.districtsService.findAll(pageNumber, limitNumber, city);
  }

  @Get('count')
  count() {
    return this.districtsService.count();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDistrictDto) {
    return this.districtsService.update(+id, dto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.districtsService.remove(+id);
  // }
}
