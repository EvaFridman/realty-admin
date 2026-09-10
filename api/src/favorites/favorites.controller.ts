import { Controller, Get, Post, Delete, Param, Query, Req, ParseIntPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service.js';
import { ListFavoritesDto } from './dto/list-favorites.dto.js';
import type { Request } from 'express';

@Controller('users/:userId/favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @Post(':listingId')
    async add(@Param('userId', ParseIntPipe) userId: number, @Param('listingId', ParseIntPipe) listingId: number, @Req() request: Request) {
        return await this.favoritesService.add(userId, listingId, request.user as any);
    }

    @Delete(':listingId')
    async remove(@Param('userId', ParseIntPipe) userId: number, @Param('listingId', ParseIntPipe) listingId: number, @Req() request: Request) {
        return await this.favoritesService.remove(userId, listingId, request.user as any);
    }

    @Get()
    async findAll(@Param('userId', ParseIntPipe) userId: number, @Query() query: ListFavoritesDto, @Req() request: Request) {
        return await this.favoritesService.findAll(userId, query, request.user as any);
    }
}
