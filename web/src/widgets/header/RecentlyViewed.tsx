"use client";

import { useEffect } from "react";
import { useAppStore } from "@/_app/providers/app-store-provider";
import styles from "./Header.module.css";

type Props = {
    serverIds: string[];
};

export function RecentlyViewed({ serverIds }: Props) {
    const ids = useAppStore((state) => state.recentlyViewedIds);
    const setRecentlyViewedIds = useAppStore((state) => state.setRecentlyViewedIds);

    useEffect(() => {
        if (serverIds.length > 0 && ids.length === 0) setRecentlyViewedIds(serverIds);
    }, [serverIds, setRecentlyViewedIds, ids.length]);

    if (!ids.length) return null;

    return (
        <section className={styles.recentlyViewed}>
            <span>Вы смотрели: </span>
            {ids.map((id, index) => (<span key={id}>{index > 0 && ", "}#{id}</span>))}
        </section>
    );
}