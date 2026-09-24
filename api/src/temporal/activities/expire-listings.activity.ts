import { Logger } from "@nestjs/common";
import { ListingsService } from "../../listings/listings.service.js";
import { CacheService } from "../../redis/cache.service.js";
import { withLock } from "../../tasks/with-lock.js";

export type ExpireListingsActivities = {
    expireListingsActivity: () => Promise<number | undefined>;
};

const logger = new Logger("ExpireListingsActivity");

export function createExpireListingsActivities(
    listingsService: ListingsService,
    cacheService: CacheService,
): ExpireListingsActivities {
    return {
        expireListingsActivity: () =>
            withLock(
                "expire-listings",
                cacheService,
                async () => {
                    const expired = await listingsService.expireOldListings();
                    logger.log(`Expire listings completed: ${expired} listings expired`);
                    return expired;
                },
                logger,
            ),
    };
}