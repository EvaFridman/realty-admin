const fs = require('fs');
const pino = require('pino');

const { LOG_DIR, LOG_FILE } = require('./src/constants/paths');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const fileStream = pino.destination({ dest: LOG_FILE, sync: false });

const streams = [{ stream: fileStream }];

if (process.env.NODE_ENV === 'production') {
  streams.push({ stream: process.stdout });
} else {
  const pretty = require('pino-pretty')({
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
  });
  streams.push({ stream: pretty });
}

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    redact: {
      paths: [
        'req.headers.authorization',
        'password',
        '*.password',
        'phone',
        '*.phone',
        'clientPhone',
        '*.clientPhone',
        'clientEmail',
        '*.clientEmail'
      ],
      censor: '[REDACTED]',
    },
  },
  pino.multistream(streams)
);

module.exports = logger;