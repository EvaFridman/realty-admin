import nodemailer from "nodemailer";
import { APP_CONFIG } from "../config";

type MailOptions = Parameters<nodemailer.Transporter["sendMail"]>[0];

function build() {
  if (APP_CONFIG.mail.transport === 'real') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 5000,
      socketTimeout: 5000,
    });
  }

  if (APP_CONFIG.mail.transport === 'stream') {
    return nodemailer.createTransport({ streamTransport: true, buffer: true });
  }

  return { sendMail: async (options: MailOptions) => ({ messageId: 'mocked', envelope: options }) };
}

export const transport = build();