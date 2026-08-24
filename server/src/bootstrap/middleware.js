const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require("path");
const { apiLimiter } = require('../middleware/rateLimiters')

const MAX_AGE = 1000 * 60 * 60 * 24 * 365;

function setupMiddleware(app) {
    app.use(helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: { "upgrade-insecure-requests": null }, // для разработки (мешает на localhost)
        },
        crossOriginResourcePolicy: { policy: "cross-origin" }, // нужно до переезда клиента и api на один домен
    }));
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));
    app.use(apiLimiter);
    app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"), { maxAge: MAX_AGE }));
    app.use(express.json({ limit: '100kb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
}

module.exports = setupMiddleware;