"use client";

import { useState, useTransition } from "react";

import styles from "../listing/ui/ListingCard.module.css";
import { toggleFavorite } from "@/features/favorites/actions";

type Props = {
    listingId: number;
    isFavorite: boolean;
    onChange?: (isFavorite: boolean) => void;
};

export function FavoriteButton({ listingId, isFavorite: initialIsFavorite, onChange }: Props) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isPending, startTransition] = useTransition();

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (isPending) return;

        startTransition(async () => {
            const result = await toggleFavorite(listingId, isFavorite);

            if (result.isFavorite !== undefined) {
                setIsFavorite(result.isFavorite);
                onChange?.(result.isFavorite);
            }
        });
    }

    return (
        <button
            type="button"
            className={styles.favorite}
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            aria-pressed={isFavorite}
            disabled={isPending}
            onClick={handleClick}
        >
            {isFavorite ? "♥" : "♡"}
        </button>
    );
}