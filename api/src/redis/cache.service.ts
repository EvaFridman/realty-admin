import { Injectable, Inject } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class CacheService {
    constructor(@Inject("REDIS") private readonly redis: Redis) {}

    async get<T>(key: string): Promise<T | null> {
        const cached = await this.redis.get(key);
        if (!cached) return null;

        try {
            return JSON.parse(cached) as T;
        } catch {
            return null;
        }
    }

    async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
        const serializedValue = JSON.stringify(value);
        await this.redis.set(key, serializedValue, "EX", ttlSeconds);
    }

    async addToTag(tag: string, key: string): Promise<void> {
        await this.redis.sadd(`tag:${tag}`, key);
    }

    async invalidateByTag(tag: string): Promise<void> {
        const tagKey = `tag:${tag}`;
        const keys = await this.redis.smembers(tagKey);
        if (keys.length > 0) await this.redis.unlink(...keys, tagKey);
    }

    async acquireLock(key: string): Promise<boolean> {
        const lockKey = `lock:${key}`;
        const result = await this.redis.set(lockKey, "1", "PX", 3000, "NX");
        return result === "OK";
    }

    async releaseLock(key: string): Promise<void> {
        await this.redis.unlink(`lock:${key}`);
    }
}