import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import type { Channel, ConsumeMessage } from "amqplib";
import { PrismaService } from "../../prisma/prisma.service.js";
import { MailService } from "../../mail/mail.service.js";

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
        try {
            const payload = JSON.parse(message.content.toString()) as { viewingId?: number };
            const viewingId = payload.viewingId;

            if (!viewingId) {
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
                this.channel.ack(message);
                return;
            }

            if (viewing.notifiedAt) {
                console.log(`Пропускаю повторную доставку viewing ${viewing.id}`);
                this.channel.ack(message);
                return;
            }
            
            const info = await this.mailService.sendNewViewingNotice(viewing.listing, viewing);

            if (info?.message) console.log(`\nВХОДЯЩЕЕ ПИСЬМО (WORKER)\n${info.message.toString()}\n`);

            await this.prisma.viewings.update({
                where: { id: viewing.id },
                data: { notifiedAt: new Date() },
            });
            
            this.channel.ack(message);
        } catch {
            this.channel.nack(message, false, !message.fields.redelivered);
        }
    }
}