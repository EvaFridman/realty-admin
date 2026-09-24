import { Logger } from "@nestjs/common";
import { CacheService } from "../redis/cache.service.js";

const TASK_LOCK_TTL = 5 * 60 * 1000;

export async function withLock<T>(name: string, cacheService: CacheService, task: () => Promise<T>, logger: Logger): Promise<T | undefined> {
    const key = `task:${name}`;
    const acquired = await cacheService.acquireLock(key, TASK_LOCK_TTL);

    if (!acquired) {
        logger.log(`Task "${name}" skipped: lock is busy`);
        return undefined;
    }

    try {
        return await task();
    } finally {
        await cacheService.releaseLock(key);
    }
}