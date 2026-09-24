import { Logger } from "@nestjs/common";
import { FilesService } from "../../files/files.service.js";
import { CacheService } from "../../redis/cache.service.js";
import { withLock } from "../../tasks/with-lock.js";

export type CleanupActivities = {
    cleanupActivity: () => Promise<number | undefined>;
};

const logger = new Logger("CleanupActivity");

export function createCleanupActivities(
    filesService: FilesService,
    cacheService: CacheService,
): CleanupActivities {
    return {
        cleanupActivity: () =>
            withLock(
                "cleanup",
                cacheService,
                async () => {
                    const removed = await filesService.removeOrphaned();
                    logger.log(`Cleanup completed: ${removed} orphaned files removed`);
                    return removed;
                },
                logger,
            ),
    };
}