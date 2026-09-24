import { NestFactory } from "@nestjs/core";
import { Worker } from "@temporalio/worker";
import { TemporalWorkerModule } from "./temporal-worker.module.js";
import { FilesService } from "../files/files.service.js";
import { CacheService } from "../redis/cache.service.js";
import { createCleanupActivities } from "./activities/cleanup.activity.js";

const TASK_QUEUE = "scheduled-tasks";

const app = await NestFactory.createApplicationContext(TemporalWorkerModule);

const filesService = app.get(FilesService);
const cacheService = app.get(CacheService);

const activities = createCleanupActivities(filesService, cacheService);

const worker = await Worker.create({
    workflowsPath: new URL("./workflows/cleanup.workflow.js", import.meta.url).pathname,
    activities,
    taskQueue: TASK_QUEUE,
});

await worker.run();