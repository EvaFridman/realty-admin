import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FilesModule } from "../files/files.module.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { RedisModule } from "../redis/redis.module.js";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, RedisModule, FilesModule],
})
export class TemporalWorkerModule {}