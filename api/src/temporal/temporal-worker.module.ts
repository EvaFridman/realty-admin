import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FilesModule } from "../files/files.module.js";
import { ListingsModule } from "../listings/listings.module.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { QueueModule } from "../queue/queue.module.js";
import { RedisModule } from "../redis/redis.module.js";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, RedisModule, FilesModule, ListingsModule, QueueModule, EventEmitterModule.forRoot()],
})
export class TemporalWorkerModule {}