import type { Response } from "express";
import ms from 'ms';
import jwt from 'jsonwebtoken';
import { APP_CONFIG } from "../config";
import { buildImageUrl } from "./imagesService";
import type { User, UserRole } from "../../database/models/user";

export function signAccessToken(user: User): string {
    return jwt.sign({ sub: user.id, role: user.role },
        APP_CONFIG.jwt.accessSecret, { expiresIn: APP_CONFIG.jwt.accessTtl });
}

export function signRefreshToken(user: User): string {
    return jwt.sign({ sub: user.id },
        APP_CONFIG.jwt.refreshSecret, { expiresIn: APP_CONFIG.jwt.refreshTtl });
}

export function setRefreshCookie(res: Response, token: string): void {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        path: '/auth',
        maxAge: ms(APP_CONFIG.jwt.refreshTtl),
    });
}

export function issuePair(res: Response, user: User): {accessToken: string; user: { id: number; email: string; role: UserRole; avatarUrl: string | null; };} {
    setRefreshCookie(res, signRefreshToken(user));
    return { accessToken: signAccessToken(user),
        user: { id: user.id, email: user.email, role: user.role, avatarUrl: user.avatarFileName ? buildImageUrl('avatars', user.avatarFileName) : null }};
}