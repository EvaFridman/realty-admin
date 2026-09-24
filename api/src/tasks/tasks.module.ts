import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module.js';
import { CleanupTask } from './cleanup.task.js';

@Module({
    imports: [FilesModule],
    providers: [CleanupTask],
})
export class TasksModule {}