import { Controller, Get, Inject } from '@nestjs/common';
import type { Channel } from 'amqplib';
import { UsersService } from '../users/users.service.js';
import { DistrictsService } from '../districts/districts.service.js';
import { CacheService } from '../redis/cache.service.js';
import { SkipThrottle } from "@nestjs/throttler";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator.js';

@ApiTags('Здоровье')
@Controller('health')
export class HealthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly districtsService: DistrictsService,
        private readonly cacheService: CacheService,
        @Inject("RABBITMQ_CHANNEL") private readonly channel: Channel,
    ) {}

    @ApiOperation({ summary: 'Проверка работоспособности бэкенда, базы данных, Redis и RabbitMQ' })
    @ApiResponse({ status: 200, description: 'Статус бэкенда успешно получен' })
    @Public()
    @SkipThrottle()
    @Get()
    async getHealth() {
        const districtsCount = await this.districtsService.count();
        const usersCount = await this.usersService.count();
        const redis = this.cacheService.isAvailable();
        const broker = await this.isBrokerAvailable();
        const cache = this.cacheService.getStats();

        return {
            status: "ok",
            districts: districtsCount,
            users: usersCount,
            redis,
            broker,
            cache,
        };
    }

    private async isBrokerAvailable() {
        try {
            await this.channel.checkQueue("mail");
            return true;
        } catch {
            return false;
        }
    }
}