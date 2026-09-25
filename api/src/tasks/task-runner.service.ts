import { Injectable, Logger } from "@nestjs/common";
import { FilesService } from "../files/files.service.js";
import { ListingsService } from "../listings/listings.service.js";
import { ViewingsService } from "../viewings/viewings.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { PublisherService } from "../queue/publisher.service.js";
import { CacheService } from "../redis/cache.service.js";
import { withLock } from "./with-lock.js";
import { dailyDigestTask } from "./daily-digest.task.js";

export const TASK_NAMES = [
    "cleanup",
    "expire-listings",
    "viewing-reminders",
    "daily-digest",
] as const;

export type TaskName = typeof TASK_NAMES[number];

@Injectable()
export class TaskRunnerService {
    private readonly logger = new Logger(TaskRunnerService.name);

    constructor(
        private readonly filesService: FilesService,
        private readonly listingsService: ListingsService,
        private readonly viewingsService: ViewingsService,
        private readonly prisma: PrismaService,
        private readonly publisherService: PublisherService,
        private readonly cacheService: CacheService,
    ) {}

    async runCleanup() {
        return withLock(
            "cleanup",
            this.cacheService,
            () => this.filesService.removeOrphaned(),
            this.logger,
        );
    }

    async runExpireListings() {
        return withLock(
            "expire-listings",
            this.cacheService,
            () => this.listingsService.expireOldListings(),
            this.logger,
        );
    }

    async runViewingReminders() {
        return withLock(
            "viewing-reminders",
            this.cacheService,
            () => this.viewingsService.sendUpcomingReminders(),
            this.logger,
        );
    }

    async runDailyDigest() {
        return withLock(
            "daily-digest",
            this.cacheService,
            () => this.runDailyDigestTask(),
            this.logger,
        );
    }

    private runDailyDigestTask() {
        return dailyDigestTask(
            this.prisma,
            this.publisherService,
            this.cacheService,
        );
    }

    async run(name: string) {
        switch (name) {
            case "cleanup":
                return this.runCleanup();
            case "expire-listings":
                return this.runExpireListings();
            case "viewing-reminders":
                return this.runViewingReminders();
            case "daily-digest":
                return this.runDailyDigest();
            default:
                return undefined;
        }
    }

    async getLastSuccess() {
        const result: Record<string, string | null> = {};

        for (const name of TASK_NAMES) {
            result[name] = await this.cacheService.getPersistent<string>(`task:last-success:${name}`);
        }

        return result;
    }
}