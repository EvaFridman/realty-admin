import { PassThrough } from "stream";
import type { Listing } from "../../database/models/listing";
import type { Viewing } from "../../database/models/viewing";
import { transport } from "./mailTransport";
import { APP_CONFIG } from "../config";
import { ExternalServiceError } from "../errors/AppError";
import { streamListingCard } from "./pdfService";
import { escapeHtml } from "../utils/escapeHtml";

type MailResult = Awaited<ReturnType<typeof transport.sendMail>>;

export  async function renderListingCardBuffer(listing: Listing): Promise<Buffer> {
    const stream = new PassThrough();
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));

    const done = new Promise<void>((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
    });

    streamListingCard(stream, listing);
    await done;

    return Buffer.concat(chunks);
}

export async function sendMailSafely(options: Parameters<typeof transport.sendMail>[0]): Promise<MailResult> {
    try {
        return await transport.sendMail({ from: APP_CONFIG.mail.from, ...options });
    } catch (err) {
        throw new ExternalServiceError('Failed to send email', [err instanceof Error ? err.message : "Unknown error"]);
    }
}

export async function sendNewViewingNotice(listing: Listing, viewing: Viewing): Promise<MailResult> {
    if (!listing.agent) throw new ExternalServiceError("Listing agent is not loaded");
    const pdfBuffer = await renderListingCardBuffer(listing);

    return sendMailSafely({
        to: listing.agent.email,
        subject: `Новая заявка на просмотр: "${listing.title}"`,
        text: `${viewing.clientName} (${viewing.clientPhone}) хочет посмотреть объявление ${viewing.preferredAt}.`,
        html: `<h1>${escapeHtml(listing.title)}</h1> <p>${escapeHtml(viewing.clientName)} (${escapeHtml(viewing.clientPhone)}) хочет посмотреть объявление ${escapeHtml(viewing.preferredAt)}.</p>`,
        attachments: [{ filename: `listing-${listing.id}.pdf`, content: pdfBuffer }],
    });
}

export async function sendViewingConfirmation(listing: Listing, viewing: Viewing): Promise<MailResult> {
    return sendMailSafely({
        to: viewing.clientEmail,
        subject: 'Просмотр подтверждён',
        text: `Ваш просмотр объявления "${listing.title}" подтверждён на ${viewing.preferredAt}.`,
        html: `<h1>${escapeHtml(listing.title)}</h1> <p>Ваш просмотр подтверждён на ${escapeHtml(viewing.preferredAt)}.</p>`,
    });
}