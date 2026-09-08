import { Controller, Query, Param, Get } from '@nestjs/common';
import { ViewingsService } from './viewings.service.js';
import type { ViewingStatus } from '../common/viewingStatusTransitions.service.js'

@Controller('viewings')
export class ViewingsController {
    constructor(private readonly viewingsService: ViewingsService) {}

    @Get()
    findAll(@Query("page") page?: string, @Query("limit") limit?: string, @Query("status") status?: ViewingStatus) {
      const pageNumber = page ? +page : undefined;
      const limitNumber = limit ? +limit : undefined;
      return this.viewingsService.findAll(pageNumber, limitNumber, status);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.viewingsService.findOne(+id);
    }
}
