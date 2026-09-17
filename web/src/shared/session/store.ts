import "server-only";

import type { AuthUser } from "./types";

export type Session = {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
};

declare global {
    var __sessions: Map<string, Session> | undefined;
}

const store = globalThis.__sessions ??= new Map<string, Session>();

export const sessions = {
    create: (session: Session): string => {
        const id = crypto.randomUUID();
        store.set(id, session);
        return id;
    },

    get: (id: string): Session | null => store.get(id) ?? null,

    update: (id: string, patch: Partial<Session>): boolean => {
        const session = store.get(id);
        if (!session) return false;
        store.set(id, { ...session, ...patch });
        return true;
    },

    destroy: (id: string): boolean => store.delete(id),
};