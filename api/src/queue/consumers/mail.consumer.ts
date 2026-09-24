import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import type { Channel, ConsumeMessage } from "amqplib";
import { PrismaService } from "../../prisma/prisma.service.js";
import { MailService } from "../../mail/mail.service.js";
import { ViewingStatus } from "../../generated/prisma/index.js";

@Injectable()
export class MailConsumer implements OnModuleInit, OnModuleDestroy {
    private consumerTag?: string;
    constructor(@Inject("RABBITMQ_CHANNEL") private readonly channel: Channel, private readonly prisma: PrismaService, private readonly mailService: MailService) {}

    async onModuleInit() {
        await this.channel.prefetch(1);

        const result = await this.channel.consume("mail", async (message) => {
            if (!message) return;
            await this.handleMessage(message);
        });

        this.consumerTag = result.consumerTag;
    }

    async onModuleDestroy() {
        if (this.consumerTag) await this.channel.cancel(this.consumerTag);
    }

    private async handleMessage(message: ConsumeMessage) {
        const startedAt = Date.now();
        const routingKey = message.fields.routingKey;
        const messageId = message.properties.messageId ?? "-";
        let result = "processed";

        try {
            const payload = JSON.parse(message.content.toString()) as {
                viewingId?: number;
                listingId?: number;
                agentId?: number;
                title?: string;
            };
            
            if (routingKey === "listing.expired") {
                const listingId = payload.listingId;
                const agentId = payload.agentId;
                const title = payload.title;
            
                if (!listingId || !agentId || !title) {
                    result = "skipped";
                    this.channel.ack(message);
                    return;
                }
            
                const agent = await this.prisma.users.findUnique({
                    where: { id: agentId },
                });
            
                if (!agent || !agent.email) {
                    result = "skipped";
                    this.channel.ack(message);
                    return;
                }
            
                await this.mailService.sendListingExpiredNotice(agent, listingId, title);
            
                this.channel.ack(message);
                return;
            }

            if (routingKey === "viewing.reminder") {
                const viewingId = payload.viewingId;
            
                if (!viewingId) {
                    result = "skipped";
                    this.channel.ack(message);
                    return;
                }
            
                const viewing = await this.prisma.viewings.findUnique({
                    where: { id: viewingId },
                    include: { listing: true },
                });
            
                if (!viewing || viewing.status !== ViewingStatus.APPROVED || viewing.reminderSentAt) {
                    result = "skipped";
                    this.channel.ack(message);
                    return;
                }
            
                await this.mailService.sendViewingReminder(viewing);
            
                await this.prisma.viewings.update({
                    where: { id: viewing.id },
                    data: { reminderSentAt: new Date() },
                });
            
                this.channel.ack(message);
                return;
            }
            
            const viewingId = payload.viewingId;
            
            if (!viewingId) {
                result = "skipped";
                this.channel.ack(message);
                return;
            }

            const viewing = await this.prisma.viewings.findUnique({
                where: { id: viewingId },
                include: {
                    listing: {
                        include: {
                            agent: true,
                            district: true,
                            photos: { orderBy: { position: "asc" } },
                        },
                    },
                },
            });

            if (!viewing) {
                result = "skipped";
                this.channel.ack(message);
                return;
            }

            if (viewing.notifiedAt) {
                result = "skipped";
                this.channel.ack(message);
                return;
            }

            await this.mailService.sendNewViewingNotice(viewing.listing, viewing);

            await this.prisma.viewings.update({
                where: { id: viewing.id },
                data: { notifiedAt: new Date() },
            });

            this.channel.ack(message);
        } catch {
            result = message.fields.redelivered ? "dead-lettered" : "retry";
            this.channel.nack(message, false, !message.fields.redelivered);
        } finally {
            console.log(`[MAIL] routingKey=${routingKey} messageId=${messageId} result=${result} duration=${Date.now() - startedAt}ms`);
        }
    }
}