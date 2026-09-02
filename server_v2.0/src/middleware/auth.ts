import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import { APP_CONFIG } from "../config";
import { UnauthorizedError, ForbiddenError } from "../errors/AppError";
import type { UserRole } from "../../database/models/user.js";

export const verifyAccessToken: RequestHandler = (req, res, next) => {
    const header = req.headers.authorization ?? "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) return next(new UnauthorizedError("No access token"));

    try {
        const payload = jwt.verify(token, APP_CONFIG.jwt.accessSecret);
        if (typeof payload === "string" || !payload.sub || !payload.role) return next(new UnauthorizedError("Invalid access token"));
        req.user = { id: Number(payload.sub), role: payload.role as UserRole };
        next();
    } catch (error) {
        const name = error instanceof Error ? error.name : "UnknownError";
        const message = name === "TokenExpiredError" ? "Access token expired" : "Invalid access token";
        next(new UnauthorizedError(message, null, name));
    }
}

export const verifyRefreshToken: RequestHandler = (req, res, next) => {
    const token = req.cookies?.refreshToken;

    if (!token) return next(new UnauthorizedError("No refresh token"));

    try {
        const payload = jwt.verify(token, APP_CONFIG.jwt.refreshSecret);
        if (typeof payload === "string" || !payload.sub) return next(new UnauthorizedError("Invalid refresh token"));
        req.userId = Number(payload.sub);
        next();
    } catch (error) {
        res.clearCookie("refreshToken", { path: "/auth" });
        const name = error instanceof Error ? error.name : "UnknownError";
        next(new UnauthorizedError('Invalid refresh token', null, name));
    }
}

export function requireRole(...roles: UserRole[]): RequestHandler {
    return (req, res, next) => {
        if (!req.user) return next(new UnauthorizedError('Not authenticated'));
        if (!roles.includes(req.user.role)) return next(new ForbiddenError(`Required roles: ${roles.join(', ')}`));
        next();
    };
}