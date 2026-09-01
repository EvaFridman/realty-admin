import "dotenv/config";

function required(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing env variable: ${name}`);
    return value;
}

export const config = {
    port: Number(process.env.PORT) || 3000,
    logLevel: process.env.LOG_LEVEL ?? "info",
    mail: {
        transport: process.env.MAIL_TRANSPORT ?? "stream",
        from: process.env.MAIL_FROM ?? "no-reply@realty-board.local",
    },
    pagination: {
        defaultSize: Number(process.env.PAGE_SIZE_DEFAULT) || 20,
        maxSize: Number(process.env.PAGE_SIZE_MAX) || 2000,
    },
    jwt: {
        accessSecret: required("JWT_ACCESS_SECRET"),
        refreshSecret: required("JWT_REFRESH_SECRET"),
        accessTtl: process.env.ACCESS_TTL ?? "15m",
        refreshTtl: process.env.REFRESH_TTL ?? "30d",
    },
} as const;