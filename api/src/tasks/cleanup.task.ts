import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import cron, { ScheduledTask } from 'node-cron';
import { FilesService } from '../files/files.service.js';
import { CacheService } from "../redis/cache.service.js";
import { withLock } from "./with-lock.js";

@Injectable()
export class CleanupTask implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(CleanupTask.name);
    private task?: ScheduledTask;

    constructor(private readonly filesService: FilesService, private readonly cacheService: CacheService) {}

    onModuleInit() {
        this.task = cron.schedule('0 3 * * *', async () => {
            await withLock(
                "cleanup",
                this.cacheService,
                async () => {
                    const removed = await this.filesService.removeOrphaned();
                    this.logger.log(`Cleanup completed: ${removed} orphaned files removed`);
                    return removed;
                },
                this.logger,
            );
        }, { timezone: 'Europe/Moscow' });

        this.logger.log("Cleanup task scheduled: 03:00 Europe/Moscow");
    }

    onModuleDestroy() {
        this.task?.stop();
    }
}