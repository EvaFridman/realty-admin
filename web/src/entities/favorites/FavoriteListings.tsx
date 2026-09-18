"use client";

import { useState } from "react";

import type { PublicListingType } from "@/entities/listing/types";
import { ListingCard } from "@/entities/listing/ui/ListingCard";

import styles from "./FavoritesList.module.css";

type Props = {
    listings: PublicListingType[];
};

export function FavoriteListings({ listings: initialListings }: Props) {
    const [listings, setListings] = useState(initialListings);

    function handleFavoriteChange(listingId: number, isFavorite: boolean) {
        if (!isFavorite) setListings((current) => current.filter((listing) => listing.id !== listingId));
    }

    if (listings.length === 0) {
        return (
            <section className={styles.empty}>
                <h3>В избранном пока ничего нет</h3>
                <p>Добавляйте объявления в избранное, чтобы вернуться к ним позже.</p>
            </section>
        );
    }

    return (
        <section className={styles.listings}>
            {listings.map((listing) => (<ListingCard key={listing.id} listing={listing} isFavorite onFavoriteChange={(isFavorite) => handleFavoriteChange(listing.id, isFavorite)} />))}
        </section>
    );
}