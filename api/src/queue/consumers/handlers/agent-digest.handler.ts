import type { Channel, ConsumeMessage } from "amqplib";
import type { PrismaService } from "../../../prisma/prisma.service.js";
import type { MailService } from "../../../mail/mail.service.js";
import type { MailPayload } from "../mail.consumer.js";

export async function handleAgentDigest(message: ConsumeMessage, payload: MailPayload, prisma: PrismaService, mailService: MailService, channel: Channel): Promise<string> {
    const agentId = payload.agentId;
    const periodFrom = payload.periodFrom;
    const periodTo = payload.periodTo;

    if (!agentId || !periodFrom || !periodTo) {
        channel.ack(message);
        return "skipped";
    }

    const from = new Date(periodFrom);
    const to = new Date(periodTo);

    const agent = await prisma.users.findUnique({ where: { id: agentId } });

    if (!agent || !agent.email) {
        channel.ack(message);
        return "skipped";
    }

    const [viewings, statusChanges] = await Promise.all([
        prisma.viewings.findMany({
            where: {
                createdAt: {
                    gte: from,
                    lt: to,
                },
                listing: {
                    agentId,
                },
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        }),
        prisma.listingStatusHistory.findMany({
            where: {
                agentId,
                createdAt: {
                    gte: from,
                    lt: to,
                },
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        }),
    ]);

    if (viewings.length === 0 && statusChanges.length === 0) {
        channel.ack(message);
        return "skipped";
    }

    await mailService.sendAgentDigest(agent, { from, to }, viewings, statusChanges);

    channel.ack(message);
    return "processed";
}