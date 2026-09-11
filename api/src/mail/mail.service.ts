import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer/lib/mailer/index.js';
import { PassThrough } from 'stream';
import { ListingPublishedEvent } from '../listings/events/listing-published.event.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ExternalServiceError } from '../errors/app.exception.js';
import { escapeHtml } from '../common/escapeHtml.service.js'; 
import { PdfService } from '../pdf/pdf.service.js'; 

type MailOptions = SendMailOptions;

@Injectable()
export class MailService {
  private transporter: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
  ) {
    const transportType = this.configService.get<string>('MAIL_TRANSPORT') ?? 'stream';

    if (transportType === 'real') {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST'),
        port: Number(this.configService.get<number>('SMTP_PORT') ?? 587),
        secure: false,
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
        connectionTimeout: 5000,
        socketTimeout: 5000,
      });
    } else if (transportType === 'stream') {
      this.transporter = nodemailer.createTransport({ 
        streamTransport: true, 
        buffer: true 
      });
    } else {
      this.transporter = { 
        sendMail: async (options: MailOptions) => ({ messageId: 'mocked', envelope: options }) 
      };
    }
  }

  async renderListingCardBuffer(listing: any): Promise<Buffer> {
    const stream = new PassThrough();
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));

    const done = new Promise<void>((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    this.pdfService.streamListingCard(stream, listing);
    await done;

    return Buffer.concat(chunks);
  }

  async sendMailSafely(options: MailOptions): Promise<any> {
    try {
      const from = this.configService.get<string>('MAIL_FROM') ?? 'no-reply@realty-board.local';
      return await this.transporter.sendMail({ from, ...options });
    } catch (err) {
      throw new ExternalServiceError('Failed to send email', [
        err instanceof Error ? err.message : 'Unknown error'
      ]);
    }
  }

  @OnEvent(ListingPublishedEvent.eventName)
  async handleListingPublishedMail(event: ListingPublishedEvent) {
    const agent = await this.prisma.users.findUnique({
      where: { id: event.agentId },
    });
    if (!agent || !agent.email) return;

    const info = await this.sendMailSafely({
      to: agent.email,
      subject: `Ваше объявление "${event.title}" успешно опубликовано!`,
      text: `Здравствуйте, ${agent.name}! Объявление #${event.listingId} успешно опубликовано.`,
      html: `<h1>${escapeHtml(event.title)}</h1><p>Здравствуйте, ${escapeHtml(agent.name)}! Объявление #${event.listingId} успешно опубликовано.</p>`,
    });

    const transportType = this.configService.get<string>('MAIL_TRANSPORT') ?? 'stream';
    if (transportType === 'stream' && info?.message) {
      console.log(`\nВХОДЯЩЕЕ ПИСЬМО (STREAM)\n${info.message.toString()}\n`);
    }
  }

  async sendNewViewingNotice(listing: any, viewing: any): Promise<any> {
    if (!listing.agent) throw new ExternalServiceError('Listing agent is not loaded');
    const pdfBuffer = await this.renderListingCardBuffer(listing);

    return this.sendMailSafely({
      to: listing.agent.email,
      subject: `Новая заявка на просмотр: "${listing.title}"`,
      text: `${viewing.clientName} (${viewing.clientPhone}) хочет посмотреть объявление ${viewing.preferredAt}.`,
      html: `<h1>${escapeHtml(listing.title)}</h1> <p>${escapeHtml(viewing.clientName)} (${escapeHtml(viewing.clientPhone)}) хочет посмотреть объявление ${escapeHtml(viewing.preferredAt)}.</p>`,
      attachments: [{ filename: `listing-${listing.id}.pdf`, content: pdfBuffer }],
    });
  }

  async sendViewingConfirmation(listing: any, viewing: any): Promise<any> {
    return this.sendMailSafely({
      to: viewing.clientEmail,
      subject: 'Просмотр подтверждён',
      text: `Ваш просмотр объявления "${listing.title}" подтверждён на ${viewing.preferredAt}.`,
      html: `<h1>${escapeHtml(listing.title)}</h1> <p>Ваш просмотр подтверждён на ${escapeHtml(viewing.preferredAt)}.</p>`,
    });
  }
}