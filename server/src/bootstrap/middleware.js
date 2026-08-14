const express = require('express');
const cors = require('cors');

function setupMiddleware(app) {
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type']
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}

module.exports = setupMiddleware;