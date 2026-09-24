import { NestFactory } from "@nestjs/core";
import { Worker } from "@temporalio/worker";
import { TemporalWorkerModule } from "./temporal-worker.module.js";
import { FilesService } from "../files/files.service.js";
import { ListingsService } from "../listings/listings.service.js";
import { CacheService } from "../redis/cache.service.js";
import { createCleanupActivities } from "./activities/cleanup.activity.js";
import { createExpireListingsActivities } from "./activities/expire-listings.activity.js";
import { ViewingsService } from "../viewings/viewings.service.js";
import { createViewingReminderActivities } from "./activities/viewing-reminder.activity.js";

const TASK_QUEUE = "scheduled-tasks";

const app = await NestFactory.createApplicationContext(TemporalWorkerModule);

const filesService = app.get(FilesService);
const listingsService = app.get(ListingsService);
const viewingsService = app.get(ViewingsService);
const cacheService = app.get(CacheService);

const cleanupActivities = createCleanupActivities(filesService, cacheService);
const expireListingsActivities = createExpireListingsActivities(listingsService, cacheService);
const viewingReminderActivities = createViewingReminderActivities(viewingsService, cacheService);

const activities = { ...cleanupActivities, ...expireListingsActivities, ...viewingReminderActivities };

const worker = await Worker.create({
    workflowsPath: new URL("./workflows/index.js", import.meta.url).pathname,
    activities,
    taskQueue: TASK_QUEUE,
});

await worker.run();