import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(private readonly configService: ConfigService) {
        super({ adapter: new PrismaPg(new Pool({ connectionString: configService.get<string>('DATABASE_URL') })) })
    }

    async onModuleInit() {
        await this.$connect();
        await this.$queryRawUnsafe('SELECT 1');
    };
    async onModuleDestroy() { await this.$disconnect() }
}