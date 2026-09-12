import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { DistrictsService } from '../districts/districts.service.js';
import { SkipThrottle } from "@nestjs/throttler";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Здоровье')
@Controller('health')
export class HealthController {
    constructor(private readonly usersService: UsersService, private readonly districtsService: DistrictsService) {}

    @ApiOperation({ summary: 'Проверка работоспособности бэкенда и базы данных' })
    @ApiResponse({ status: 200, description: 'Статус бэкенда успешно получен' })
    @SkipThrottle()
    @Get()
    getHealth() {
        const districtsCount = this.districtsService.count();
        const usersCount = this.usersService.count();

        return { status: "ok", districts: districtsCount, users: usersCount };
    }
}