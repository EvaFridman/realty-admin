import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Global()
@Module({
    providers: [{
        provide: "REDIS",
        inject: [ConfigService],
        useFactory: (config: ConfigService) => new Redis({
            host: config.getOrThrow<string>("REDIS_HOST"),
            port: Number(config.getOrThrow("REDIS_PORT")),
            db: 0,
        })
    }],
    exports: ["REDIS"],
})
export class RedisModule {}