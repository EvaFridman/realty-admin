"use client";

import { useEffect } from "react";
import { useAppStore } from "@/_app/providers/app-store-provider";

type Props = {
    listingId: number;
};

export function RecentlyViewedTracker({ listingId }: Props) {
    const addRecentlyViewedId = useAppStore((state) => state.addRecentlyViewedId);

    useEffect(() => {
        const idString = String(listingId);
        addRecentlyViewedId(idString);
        const cookieName = "recentlyViewed";
        const maxItems = 5;
        const cookie = document.cookie.split("; ").find((item) => item.startsWith(`${cookieName}=`));
        const viewed = cookie ? decodeURIComponent(cookie.split("=")[1]).split(",").filter(Boolean) : [];
        const nextViewed = [idString, ...viewed.filter((id) => id !== idString)].slice(0, maxItems);
        document.cookie = `${cookieName}=${encodeURIComponent(nextViewed.join(","))}; path=/; max-age=2592000`;
    }, [listingId, addRecentlyViewedId]);

    return null;
}