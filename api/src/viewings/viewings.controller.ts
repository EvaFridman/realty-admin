import { Controller, Query, Param, Get } from '@nestjs/common';
import { ViewingsService } from './viewings.service.js';
import { ListViewingsDto } from './dto/list-viewings.dto.js';

@Controller('viewings')
export class ViewingsController {
    constructor(private readonly viewingsService: ViewingsService) {}

    @Get()
    findAll(@Query() query: ListViewingsDto) {
      const { page, limit, status } = query;
      return this.viewingsService.findAll(page, limit, status);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.viewingsService.findOne(+id);
    }
}
