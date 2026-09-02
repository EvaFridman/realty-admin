import fs from "fs";
import pino from "pino";
import pretty from "pino-pretty";
import { LOG_DIR, LOG_FILE } from "../constants/paths";

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const fileStream = pino.destination({ dest: LOG_FILE, sync: false });

const streams: pino.StreamEntry[] = [ { stream: fileStream } ];

if (process.env.NODE_ENV === "production") {
    streams.push({ stream: process.stdout });
} else {
    streams.push({
        stream: pretty({
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
        }),
    });
}

export const logger = pino(
    {
        level: process.env.LOG_LEVEL || "info",
        redact: {
            paths: [
                "req.headers.authorization",
                "password",
                "*.password",
                "phone",
                "*.phone",
                "clientPhone",
                "*.clientPhone",
                "clientEmail",
                "*.clientEmail",
            ],
            censor: "[REDACTED]",
        },
    },
    pino.multistream(streams),
);