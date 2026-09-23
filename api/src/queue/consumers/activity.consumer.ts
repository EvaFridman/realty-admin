import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import type { Channel, ConsumeMessage } from "amqplib";
import { CacheService } from "../../redis/cache.service.js";

@Injectable()
export class ActivityConsumer implements OnModuleInit, OnModuleDestroy {
    private consumerTag?: string;
    constructor(@Inject("RABBITMQ_CHANNEL") private readonly channel: Channel, private readonly cacheService: CacheService) {}

    async onModuleInit() {
        await this.channel.prefetch(1);

        const result = await this.channel.consume("activity", async (message) => {
            if (!message) return;
            await this.handleMessage(message);
        });

        this.consumerTag = result.consumerTag;
    }

    async onModuleDestroy() {
        if (this.consumerTag) await this.channel.cancel(this.consumerTag);
    }

    private async handleMessage(message: ConsumeMessage) {
        try {
            const payload = JSON.parse(message.content.toString()) as {
                listingId?: number;
                viewingId?: number;
            };

            const routingKey = message.fields.routingKey;
            const entityId = payload.listingId ?? payload.viewingId;
            const messageId = message.properties.messageId;

            console.log(`[ACTIVITY] ${new Date().toISOString()} ${routingKey} ${entityId ?? "unknown"}`);

            if (routingKey === "listing.published") {
                if (!messageId) {
                    this.channel.ack(message);
                    return;
                }

                const sentKey = `sent:${messageId}`;
                const alreadySent = await this.cacheService.get<boolean>(sentKey);

                if (alreadySent) {
                    console.log(`[ACTIVITY] Пропускаю повторную доставку ${messageId}`);
                    this.channel.ack(message);
                    return;
                }

                await this.cacheService.invalidateByTag("listings");
                await this.cacheService.set(sentKey, true, 86400);
            }

            this.channel.ack(message);
        } catch {
            this.channel.nack(message, false, !message.fields.redelivered);
        }
    }
}