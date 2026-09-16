import { cache } from "react";
import { cookies } from "next/headers";

import { sessions } from "./store";

export const getSession = cache(async () => {
    const id = (await cookies()).get("sid")?.value;
    if (!id) return null;
    const session = sessions.get(id);
    if (!session) return null;
    return { id, ...session };
});