import { Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { PublisherService } from "../../queue/publisher.service.js";
import { CacheService } from "../../redis/cache.service.js";
import { dailyDigestTask } from "../../tasks/daily-digest.task.js";

export type DailyDigestActivities = {
    dailyDigestActivity: () => Promise<number | undefined>;
};

const logger = new Logger("DailyDigestActivity");

export function createDailyDigestActivities(
    prisma: PrismaService,
    publisherService: PublisherService,
    cacheService: CacheService,
): DailyDigestActivities {
    return {
        dailyDigestActivity: async () => {
            const published = await dailyDigestTask(prisma, publisherService, cacheService);
            logger.log(`Daily digest completed: ${published} agents`);
            return published;
        },
    };
}