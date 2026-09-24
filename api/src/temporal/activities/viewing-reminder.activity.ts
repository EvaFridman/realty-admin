import { Logger } from "@nestjs/common";
import { ViewingsService } from "../../viewings/viewings.service.js";
import { CacheService } from "../../redis/cache.service.js";
import { withLock } from "../../tasks/with-lock.js";

export type ViewingReminderActivities = {
    sendViewingRemindersActivity: () => Promise<number | undefined>;
};

const logger = new Logger("ViewingReminderActivity");

export function createViewingReminderActivities(
    viewingsService: ViewingsService,
    cacheService: CacheService,
): ViewingReminderActivities {
    return {
        sendViewingRemindersActivity: () =>
            withLock(
                "viewing-reminders",
                cacheService,
                async () => {
                    const sent = await viewingsService.sendUpcomingReminders();
                    logger.log(`Viewing reminders completed: ${sent} reminders published`);
                    return sent;
                },
                logger,
            ),
    };
}