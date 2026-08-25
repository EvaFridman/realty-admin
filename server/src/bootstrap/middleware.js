const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require("path");
const { apiLimiter } = require('../middleware/rateLimiters')

const MAX_AGE = 1000 * 60 * 60 * 24 * 365;
const BASE_URL = process.env.PUBLIC_URL;
const CLIENT_URL = 'http://localhost:5173';

function setupMiddleware(app) {
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
                imgSrc: ["'self'", "data:", BASE_URL, CLIENT_URL],
                connectSrc: ["'self'", BASE_URL, CLIENT_URL],
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
    app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"), { maxAge: MAX_AGE }));
}

module.exports = setupMiddleware;