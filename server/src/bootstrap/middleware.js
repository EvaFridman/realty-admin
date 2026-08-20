const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require("path");

function setupMiddleware(app) {
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));
    app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"), { maxAge: 1000 * 60 * 60 * 24 * 365  }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
}

module.exports = setupMiddleware;