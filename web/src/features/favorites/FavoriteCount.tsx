"use client";

import { useEffect, useState } from "react";

import { http } from "@/shared/api/http";

import styles from "./FavoriteCount.module.css";

export function FavoriteCount() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        http.get<{ count: number }>("/favorites").then(({ data }) => setCount(data.count)).catch(() => setCount(0));
    }, []);

    if (count === null) return null;

    return <span className={styles.count}>{count}</span>;
}