import type { AppSocket, RateLimitCounter } from "./types";

export function socketRateLimiter(socket: AppSocket & { rateLimitCounter?: RateLimitCounter }, next: (err?: Error) => void): void {
    if (!socket.rateLimitCounter) {
        socket.rateLimitCounter = {
            eventCount: 0,
            intervalStart: Date.now()
        };
    }

    const now = Date.now();
    const data = socket.rateLimitCounter;

    if (now - data.intervalStart >= 1000) {
        data.eventCount = 0;
        data.intervalStart = now;
    }

    data.eventCount++;

    if (data.eventCount > 100) {
        console.warn(`[SECURITY] Сокет ${socket.id} превысил лимит событий (${data.eventCount}/сек). Принудительное отключение.`);
        socket.disconnect(true);
        return;
    }

    next();
};
