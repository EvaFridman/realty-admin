import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

import { TooManyRequestsError } from "../errors/AppError";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    keyGenerator: (req: Request) => `${ipKeyGenerator(req.ip ?? "")}:${req.body?.email ?? ""}`,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many login attempts, try again later")),
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many register attempts, try again later")),
});

export const viewingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many attempts to submit a request for viewing, try again later",)),
});

export const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many upload attempts, try again later")),
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many attempts, try again later")),
});

export const cspReportLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    handler: (req, res, next) => next(new TooManyRequestsError("Too many CSP reports")),
});