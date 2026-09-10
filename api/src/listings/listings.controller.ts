import { Controller, ParseIntPipe, Query, Body, Param, Req, Get, Post, Patch } from '@nestjs/common';
import { ListingsService } from './listings.service.js';
import { ListListingsDto } from './dto/list-listings.dto.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js'
import { UpdateStatusDto } from './dto/update-status.dto.js'
import type { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Get()
    async findAll(@Query() query: ListListingsDto, @Req() request: Request) {
        const currentUser = request.user as { id: number; role: string };
        return await this.listingsService.findAll(query, currentUser);
    }

    @Post()
    async create(@Body() dto: CreateListingDto, @Req() request: Request) {
      const user = request.user as { id: number };
      return await this.listingsService.create(dto, user.id);
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
      return await this.listingsService.findOne(id, request.user as any);
    }
  
    @Patch(':id')
    async update( @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateListingDto, @Req() request: Request) {
      return await this.listingsService.update(id, dto, request.user as any);
    }
  
    @Roles('moderator')
    @Patch(':id/status')
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
      return await this.listingsService.updateStatus(id, dto);
    }
}
