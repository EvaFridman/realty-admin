import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";
import { CacheService } from "./cache.service.js";
import { LoginBlockService } from "./login-block.service.js";

@Global()
@Module({
    providers: [{
        provide: "REDIS",
        inject: [ConfigService],
        useFactory: (config: ConfigService) => new Redis({
            host: config.getOrThrow<string>("REDIS_HOST"),
            port: Number(config.getOrThrow("REDIS_PORT")),
            db: 0,
        }),
    },
        CacheService, LoginBlockService,
    ],
    exports: ["REDIS", CacheService, LoginBlockService],
})
export class RedisModule {}