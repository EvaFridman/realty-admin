"use client";

import { useEffect, useState, useRef } from "react";

import styles from "./ListingInfiniteList.module.css";

import { ListingCard } from "@/entities/listing/ui/ListingCard";
import { useInfiniteListings } from "@/entities/listing/api/use-listings";
import type { PublicListingType, PublicListingsMetaType } from "@/entities/listing/types";
import { http } from "@/shared/api/http";
import { Skeleton } from "@/shared/ui";

type QueryValueType = string | number | string[] | undefined;

type Props = {
    initialItems: PublicListingType[];
    initialMeta: PublicListingsMetaType;
    query: Record<string, QueryValueType>;
    view: "grid" | "list";
};

export function ListingInfiniteList({ initialItems, initialMeta, query, view }: Props) {
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteListings({ query, initialItems, initialMeta });

    const allItems = data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        http.get<number[]>("/favorites/ids")
            .then(({ data }) => setFavoriteIds(data))
            .catch(() => setFavoriteIds([]));
    }, []);

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) fetchNextPage() },
            { threshold: 0.1 }
        );

        if (observerRef.current) observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <>
            {allItems.length > 0 ? (
                <section className={view === "list" ? styles.listingsList : styles.listings}>
                    {allItems.map((listing) => (<ListingCard key={listing.id} listing={listing} variant={view === "list" ? "row" : "tile"} isFavorite={favoriteIds.includes(listing.id)} />))}

                    {isFetchingNextPage &&
                        Array.from({ length: 3 }).map((_, index) => (
                            <article key={index} className={styles.card}>
                                <Skeleton width="100%" height="190px" />
                                <div className={styles.cardContent}>
                                    <Skeleton width="55%" height="22px" />
                                    <Skeleton width="80%" height="18px" />
                                    <Skeleton width="65%" height="16px" />
                                    <Skeleton width="90%" height="14px" />
                                </div>
                            </article>
                        ))
                    }
                </section>
            ) : (
                <div className={styles.empty}>
                    <h2>Ничего не найдено</h2>
                    <p>Попробуйте изменить параметры поиска или сбросить фильтры.</p>
                </div>
            )}

            {hasNextPage && !isFetchingNextPage && (
                <div ref={observerRef} className={styles.observerToken} />
            )}
        </>
    );
}
