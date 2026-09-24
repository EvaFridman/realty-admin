import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import cron, { ScheduledTask } from 'node-cron';
import { FilesService } from '../files/files.service.js';

@Injectable()
export class CleanupTask implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(CleanupTask.name);
    private task?: ScheduledTask;

    constructor(private readonly filesService: FilesService) {}

    onModuleInit() {
        this.task = cron.schedule('0 3 * * *', async () => {
            const removed = await this.filesService.removeOrphaned();
            this.logger.log(`Cleanup completed: ${removed} orphaned files removed`);
        }, { timezone: 'Europe/Moscow' });

        this.logger.log('Cleanup task scheduled: 03:00 Europe/Moscow');
    }

    onModuleDestroy() {
        this.task?.stop();
    }
}