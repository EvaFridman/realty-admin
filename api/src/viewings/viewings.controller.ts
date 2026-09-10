import { Controller, Query, Param, Get, Post, Patch, Body, Req, ParseIntPipe } from '@nestjs/common';
import { ViewingsService } from './viewings.service.js';
import { ListViewingsDto } from './dto/list-viewings.dto.js';
import { CreateViewingDto } from './dto/create-viewing.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { Public } from '../auth/decorators/public.decorator.js';
import type { Request } from 'express';

@Controller()
export class ViewingsController {
    constructor(private readonly viewingsService: ViewingsService) {}

    @Get('viewings')
    async findAll(@Query() query: ListViewingsDto, @Req() request: Request) {
        return await this.viewingsService.findAll(query, request.user as any);
    }

    @Get('viewings/:id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        return await this.viewingsService.findOne(id, request.user as any);
    }

    @Public()
    @Post('listings/:id/viewings')
    async create(@Param('id', ParseIntPipe) listingId: number, @Body() dto: CreateViewingDto) {
        return await this.viewingsService.create(listingId, dto);
    }

    @Patch('viewings/:id/status')
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto, @Req() request: Request) {
        return await this.viewingsService.updateStatus(id, dto, request.user as any);
    }
}
