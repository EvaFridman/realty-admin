import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { DistrictsService } from '../districts/districts.service.js';
import { CacheService } from '../redis/cache.service.js';
import { SkipThrottle } from "@nestjs/throttler";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator.js';

@ApiTags('Здоровье')
@Controller('health')
export class HealthController {
    constructor(private readonly usersService: UsersService, private readonly districtsService: DistrictsService, private readonly cacheService: CacheService) {}

    @ApiOperation({ summary: 'Проверка работоспособности бэкенда, базы данных и Redis' })
    @ApiResponse({ status: 200, description: 'Статус бэкенда успешно получен' })
    @Public()
    @SkipThrottle()
    @Get()
    async getHealth() {
        const districtsCount = await this.districtsService.count();
        const usersCount = await this.usersService.count();
        const redis = this.cacheService.isAvailable();
        const cache = this.cacheService.getStats();

        return {
            status: "ok",
            districts: districtsCount,
            users: usersCount,
            redis,
            cache,
        };
    }
}