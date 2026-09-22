import { Module } from '@nestjs/common';
import { PublicService } from './public.service.js';
import { PublicController } from './public.controller.js';
import { CacheService } from '../redis/cache.service.js';

@Module({
    controllers: [PublicController],
    providers: [PublicService, CacheService],
    exports: [PublicService],
})
export class PublicModule {}