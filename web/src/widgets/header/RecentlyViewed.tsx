import { cookies } from "next/headers";
import type { ReactNode } from "react";

import styles from "./Header.module.css";

const cookieName = "recentlyViewed";

export async function RecentlyViewed(): Promise<ReactNode> {
    const cookieStore = await cookies();
    const value = cookieStore.get(cookieName)?.value;
    const ids = value ? decodeURIComponent(value).split(",").filter(Boolean) : [];

    if (!ids.length) return null;

    return (
        <section className={styles.recentlyViewed}>
            <span>Вы смотрели: </span>
            {ids.map((id, index) => (<span key={id}> {index > 0 && ", "}#{id}</span>))}
        </section>
    );
}