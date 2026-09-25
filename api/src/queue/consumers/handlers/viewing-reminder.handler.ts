import type { Channel, ConsumeMessage } from "amqplib";
import { ViewingStatus } from "../../../generated/prisma/index.js";
import type { PrismaService } from "../../../prisma/prisma.service.js";
import type { MailService } from "../../../mail/mail.service.js";
import type { MailPayload } from "../mail.consumer.js";

export async function handleViewingReminder(message: ConsumeMessage, payload: MailPayload, prisma: PrismaService, mailService: MailService, channel: Channel): Promise<string> {
    const viewingId = payload.viewingId;

    if (!viewingId) {
        channel.ack(message);
        return "skipped";
    }

    const viewing = await prisma.viewings.findUnique({
        where: { id: viewingId },
        include: { listing: true },
    });

    if (!viewing || viewing.status !== ViewingStatus.APPROVED || viewing.reminderSentAt) {
        channel.ack(message);
        return "skipped";
    }

    await mailService.sendViewingReminder(viewing);

    await prisma.viewings.update({
        where: { id: viewing.id },
        data: { reminderSentAt: new Date() },
    });

    channel.ack(message);
    return "processed";
}