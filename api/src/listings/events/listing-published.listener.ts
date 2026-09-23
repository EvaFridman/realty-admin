import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

import { ListingPublishedEvent } from './listing-published.event.js';

@Injectable()
export class ListingPublishedListener {
    private readonly logger = new Logger(ListingPublishedListener.name);

    constructor(private readonly configService: ConfigService) {}

    @OnEvent(ListingPublishedEvent.eventName)
    async handle(event: ListingPublishedEvent) {
        const webUrl = this.configService.get<string>('WEB_URL');
        const secret = this.configService.get<string>('REVALIDATE_SECRET');

        if (!webUrl || !secret) {
            this.logger.error('Cannot revalidate public site: WEB_URL or REVALIDATE_SECRET is not configured');
            return;
        }

        try {
            const response = await fetch(`${webUrl}/api/revalidate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${secret}`,
                },
                body: JSON.stringify({ tag: 'listings' }),
            });

            if (!response.ok) {
                const body = await response.text();
                this.logger.error(`Public site revalidation failed: ${response.status} ${body}`);
                return;
            }

            this.logger.log(`Public site cache revalidated after listing ${event.listingId} was published`);
        } catch (error) {
            this.logger.error(`Public site revalidation request failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}