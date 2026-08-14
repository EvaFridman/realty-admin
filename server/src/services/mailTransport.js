const nodemailer = require('nodemailer');
const config = require('../config');

function build() {
  if (config.mail.transport === 'real') {
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

  if (config.mail.transport === 'stream') {
    return nodemailer.createTransport({ streamTransport: true, buffer: true });
  }

  return { sendMail: async (options) => ({ messageId: 'mocked', envelope: options }) };
}

const transport = build();

module.exports = transport;