import type { Channel, ConsumeMessage } from "amqplib";
import type { PrismaService } from "../../../prisma/prisma.service.js";
import type { MailService } from "../../../mail/mail.service.js";
import type { MailPayload } from "../mail.consumer.js";

export async function handleListingExpired(message: ConsumeMessage, payload: MailPayload, prisma: PrismaService, mailService: MailService, channel: Channel): Promise<string> {
    const listingId = payload.listingId;
    const agentId = payload.agentId;
    const title = payload.title;

    if (!listingId || !agentId || !title) {
        channel.ack(message);
        return "skipped";
    }

    const agent = await prisma.users.findUnique({ where: { id: agentId } });

    if (!agent || !agent.email) {
        channel.ack(message);
        return "skipped";
    }

    await mailService.sendListingExpiredNotice(agent, listingId, title);

    channel.ack(message);
    return "processed";
}