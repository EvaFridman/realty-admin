import { cache } from "react";
import { cookies } from "next/headers";

import { sessions } from "./store";

export const getSession = cache(async () => {
    const id = (await cookies()).get("sid")?.value;
    if (!id) return null;

    const session = await sessions.get(id);
    if (!session) return null;

    try {
        const response = await fetch(`${process.env.API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        });

        if (!response.ok) return null;

        const result = await response.json();
        const user = result.data ?? result;

        return {
            id,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            user,
        };
    } catch {
        return null;
    }
});