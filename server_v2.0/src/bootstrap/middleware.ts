import type { Express } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { apiLimiter } from "../middleware/rateLimiters";

const BASE_URL = process.env.PUBLIC_URL;
const CLIENT_URL = 'http://localhost:5173';
const imgSrc = ["'self'", "data:", CLIENT_URL];
const connectSrc = ["'self'", CLIENT_URL];

if (BASE_URL) {
    imgSrc.push(BASE_URL);
    connectSrc.push(BASE_URL);
}

export function setupMiddleware(app: Express): void {
    app.use(express.json({ 
        limit: '100kb', 
        type: ['application/json', 'application/csp-report'] 
    }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(helmet({
        contentSecurityPolicy: {
            reportOnly: true,
            useDefaults: true,
            directives: {
                "upgrade-insecure-requests": null,  // для разработки (мешает на localhost)
                defaultSrc: ["'self'"],
                imgSrc,
                connectSrc,
                reportUri: "/csp-report",
            },
        },
        crossOriginResourcePolicy: { policy: "cross-origin" }, // нужно до переезда клиента и api на один домен
    }));
    app.use(cors({
        origin: CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));
    app.use(apiLimiter);
}