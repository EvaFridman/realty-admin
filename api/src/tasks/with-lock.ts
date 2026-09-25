import { Logger } from "@nestjs/common";
import { CacheService } from "../redis/cache.service.js";

const TASK_LOCK_TTL = 5 * 60 * 1000;

export async function withLock<T>(name: string, cacheService: CacheService, task: () => Promise<T>, logger: Logger): Promise<T | undefined> {
    const startedAt = Date.now();
    const key = `task:${name}`;
    const acquired = await cacheService.acquireLock(key, TASK_LOCK_TTL);

    if (!acquired) {
        logger.log(`[Task] ${name} skipped: lock is busy`);
        return undefined;
    }

    try {
        const result = await task();
        const duration = Date.now() - startedAt;
        const processed = typeof result === "number" ? result : 0;

        await cacheService.setPersistent(`task:last-success:${name}`, new Date().toISOString());

        logger.log(`[Task] ${name} completed duration=${duration}ms result=success processed=${processed}`);

        return result;
    } catch (error) {
        const duration = Date.now() - startedAt;
        const message = error instanceof Error ? error.message : String(error);

        logger.error(`[Task] ${name} failed duration=${duration}ms result=error error="${message}"`);

        return undefined;
    } finally {
        await cacheService.releaseLock(key);
    }
}