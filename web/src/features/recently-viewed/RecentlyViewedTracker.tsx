"use client";

import { useEffect } from "react";

type Props = {
    listingId: number;
};

export function RecentlyViewedTracker({ listingId }: Props) {
    useEffect(() => {
        const cookieName = "recentlyViewed";
        const maxItems = 5;
        const cookie = document.cookie.split("; ").find((item) => item.startsWith(`${cookieName}=`));
        const viewed = cookie ? decodeURIComponent(cookie.split("=")[1]).split(",").filter(Boolean) : [];
        const nextViewed = [String(listingId), ...viewed.filter((id) => id !== String(listingId))].slice(0, maxItems);
        document.cookie = `${cookieName}=${encodeURIComponent(nextViewed.join(","))}; path=/; max-age=2592000`;
    }, [listingId]);

    return null;
}