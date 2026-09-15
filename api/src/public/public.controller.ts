import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator.js';
import { PublicService } from './public.service.js';
import { PublicListingsDto } from './dto/public-listings.dto.js';
import { ListDistrictsDto } from '../districts/dto/list-districts.dto.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Витрина')
@Public()
@Controller('public')
export class PublicController {
    constructor(private readonly publicService: PublicService) { }

    @ApiOperation({ summary: 'Список опубликованных объявлений для витрины' })
    @ApiResponse({ status: 200, description: 'Список объявлений и метаданные пагинации успешно получены' })
    @Get('listings')
    async findAllListings(@Query() query: PublicListingsDto) {
        return await this.publicService.findAllListings(query);
    }

    @ApiOperation({ summary: 'Номер телефона агента по ID' })
    @ApiResponse({ status: 200, description: 'Номер телефона агента успешно получен' })
    @ApiResponse({ status: 404, description: 'Номер телефона агента не найден' })
    @Get('agents/:id/phone')
    async findAgentPhone(@Param('id', ParseIntPipe) id: number) {
        return await this.publicService.findAgentPhone(id);
    }

    @ApiOperation({ summary: 'Информация об объявлении по ID' })
    @ApiResponse({ status: 200, description: 'Информация об объявлении успешно получена' })
    @ApiResponse({ status: 404, description: 'Объявление не найдено' })
    @Get('listings/:id')
    async findOneListing(@Param('id', ParseIntPipe) id: number) {
        return await this.publicService.findOneListing(id);
    }

    @ApiOperation({ summary: 'Список районов с количеством опубликованных объектов' })
    @ApiResponse({ status: 200, description: 'Список районов успешно получен' })
    @Get('districts')
    async findAllDistricts(@Query() query: ListDistrictsDto) {
        const { page, limit, city } = query;
        return await this.publicService.findAllDistricts(page, limit, city);
    }
}