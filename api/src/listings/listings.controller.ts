import { Controller, Query, Req, Get } from '@nestjs/common';
import { ListingsService } from './listings.service.js';
import { ListListingsDto } from './dto/list-listings.dto.js';
import type { Request } from 'express';

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Get()
    async findAll(@Query() query: ListListingsDto, @Req() request: Request) {
        const currentUser = request.user as { id: number; role: string };
        return await this.listingsService.findAll(query, currentUser);
    }
}
