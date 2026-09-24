import { Module } from "@nestjs/common";
import { FilesModule } from "../files/files.module.js";
import { RedisModule } from "../redis/redis.module.js";
import { CleanupTask } from "./cleanup.task.js";

@Module({
    imports: [FilesModule, RedisModule],
    providers: [CleanupTask],
})
export class TasksModule {}