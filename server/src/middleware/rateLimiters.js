const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const { TooManyRequestsError } = require('../errors/AppError');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${req.body?.email ?? ''}`,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many login attempts, try again later"))
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many register attempts, try again later"))
});

const viewingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many attempts to submit a request for viewing, try again later"))
});

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many upload attempts, try again later"))
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many attempts, try again later"))
});

const cspReportLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many CSP reports"))
});

module.exports = { loginLimiter, registerLimiter, viewingLimiter, uploadLimiter, apiLimiter, cspReportLimiter }