"use client";

import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import styles from "./Header.module.css";

const cookieName = "recentlyViewed";

function getViewedIds(): string[] {
    const cookie = document.cookie.split("; ").find((item) => item.startsWith(`${cookieName}=`));
    if (!cookie) return [];
    const value = decodeURIComponent(cookie.split("=")[1]);
    return value.split(",").filter(Boolean);
}

const recentlyViewedStore = {
    subscribe() {
        return () => { };
    },

    getSnapshot() {
        return getViewedIds().join(",");
    },

    getServerSnapshot() {
        return "";
    },

};

export function RecentlyViewed(): ReactNode {
    const value = useSyncExternalStore(
        recentlyViewedStore.subscribe,
        recentlyViewedStore.getSnapshot,
        recentlyViewedStore.getServerSnapshot,
    );

    const ids = value ? value.split(",") : [];

    if (!ids.length) return null;

    return (
        <section className={styles.recentlyViewed}>
            <span>Вы смотрели: </span>
            {ids.map((id, index) => (<span key={id}> {index > 0 && ", "}#{id}</span>))}
        </section>
    );
}