import { Controller, Get, Param, Query, ParseIntPipe, Post, Body, Req } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator.js';
import { OptionalAuth } from '../auth/decorators/optional-auth.decorator.js';
import { PublicService } from './public.service.js';
import { PublicListingsDto } from './dto/public-listings.dto.js';
import { ListDistrictsDto } from '../districts/dto/list-districts.dto.js';
import { CreateViewingDto } from '../viewings/dto/create-viewing.dto.js';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Витрина')
@Controller('public')
export class PublicController {
    constructor(private readonly publicService: PublicService) { }

    @ApiOperation({ summary: 'Список опубликованных объявлений для витрины' })
    @ApiResponse({ status: 200, description: 'Список объявлений и метаданные пагинации успешно получены' })
    @Public()
    @Get('listings')
    async findAllListings(@Query() query: PublicListingsDto) {
        return await this.publicService.findAllListings(query);
    }

    @ApiOperation({ summary: 'Номер телефона агента по ID' })
    @ApiResponse({ status: 200, description: 'Номер телефона агента успешно получен' })
    @ApiResponse({ status: 404, description: 'Номер телефона агента не найден' })
    @Public()
    @Get('agents/:id/phone')
    async findAgentPhone(@Param('id', ParseIntPipe) id: number) {
        return await this.publicService.findAgentPhone(id);
    }

    @ApiOperation({ summary: 'Информация занятом времени для просмотра по объявлению' })
    @ApiResponse({ status: 200, description: 'Информация об занятом времени для просмотра по объявлению успешно получена' })
    @ApiResponse({ status: 404, description: 'Информация об занятом времени для просмотра по объявлению не найдена' })
    @Public()
    @Get('listings/:id/busy-viewing-times')
    async findBusyViewingTimes(@Param('id', ParseIntPipe) id: number) {
        return await this.publicService.findBusyViewingTimes(id);
    }

    @ApiOperation({ summary: 'Информация об объявлении по ID' })
    @ApiResponse({ status: 200, description: 'Информация об объявлении успешно получена' })
    @ApiResponse({ status: 404, description: 'Объявление не найдено' })
    @Public()
    @Get('listings/:id')
    async findOneListing(@Param('id', ParseIntPipe) id: number) {
        return await this.publicService.findOneListing(id);
    }

    @ApiOperation({ summary: 'Создать заявку на просмотр объявления' })
    @ApiResponse({ status: 201, description: 'Заявка на просмотр успешно создана' })
    @ApiResponse({ status: 400, description: 'Некорректные входные данные' })
    @ApiResponse({ status: 404, description: 'Объявление не найдено' })
    @ApiResponse({ status: 429, description: 'Превышен лимит заявок' })
    @Throttle({ viewingPublic: { ttl: 15 * 60_000, limit: 5 } })
    @OptionalAuth()
    @Post('listings/:id/viewings')
    async createViewing(@Param('id', ParseIntPipe) listingId: number, @Body() dto: CreateViewingDto, @Req() request: Request) {
        return await this.publicService.createViewing(listingId, dto, request.user as any);
    }

    @ApiOperation({ summary: 'Список районов с количеством опубликованных объектов' })
    @Public()
    @Get('districts')
    async findAllDistricts(@Query() query: ListDistrictsDto) {
        const { page, limit, city } = query;
        return await this.publicService.findAllDistricts(page, limit, city);
    }

    @ApiOperation({ summary: 'Информация о районе по slug' })
    @Public()
    @Get('districts/:slug')
    async findDistrictBySlug(@Param('slug') slug: string) {
        return await this.publicService.findDistrictBySlug(slug);
    }
}