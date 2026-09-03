import jwt from "jsonwebtoken";

process.env.JWT_ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET || "test-access-secret-for-jest-only";

process.env.JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "test-refresh-secret-for-jest-only";

process.env.ACCESS_TTL = process.env.ACCESS_TTL || "15m";
process.env.REFRESH_TTL = process.env.REFRESH_TTL || "30d";
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "silent";
process.env.MAIL_TRANSPORT = "stream";

export const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

type TestUser = {
    id: number;
    role: string;
};

export function signTestAccessToken(user: TestUser): string {
    return jwt.sign(
        { sub: user.id, role: user.role },
        ACCESS_SECRET,
        { expiresIn: "15m" }
    );
}

export function signTestRefreshToken(user: TestUser): string {
    return jwt.sign(
        { sub: user.id },
        REFRESH_SECRET,
        { expiresIn: "30d" }
    );
}

export function authHeader(user: TestUser): { Authorization: string } {
    return {
        Authorization: `Bearer ${signTestAccessToken(user)}`,
    };
}