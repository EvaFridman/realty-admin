const { PassThrough } = require('stream');
const transport = require('./mailTransport');
const pdfService = require('./pdfService');
const config = require('../config');
const { ExternalServiceError } = require('../errors/AppError');

async function renderListingCardBuffer(listing) {
    const stream = new PassThrough();
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));

    const done = new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
    });

    pdfService.streamListingCard(stream, listing);
    await done;

    return Buffer.concat(chunks);
}

async function sendMailSafely(options) {
    try {
        return await transport.sendMail({ from: config.mail.from, ...options });
    } catch (err) {
        throw new ExternalServiceError('Failed to send email', { cause: err.message });
    }
}

async function sendNewViewingNotice(listing, viewing) {
    const pdfBuffer = await renderListingCardBuffer(listing);

    return sendMailSafely({
        to: listing.agent.email,
        subject: `Новая заявка на просмотр: "${listing.title}"`,
        text: `${viewing.clientName} (${viewing.clientPhone}) хочет посмотреть объявление ${viewing.preferredAt}.`,
        attachments: [{ filename: `listing-${listing.id}.pdf`, content: pdfBuffer }],
    });
}

async function sendViewingConfirmation(listing, viewing) {
    return sendMailSafely({
        to: viewing.clientEmail,
        subject: 'Просмотр подтверждён',
        text: `Ваш просмотр объявления "${listing.title}" подтверждён на ${viewing.preferredAt}.`,
    });
}

module.exports = { sendNewViewingNotice, sendViewingConfirmation };