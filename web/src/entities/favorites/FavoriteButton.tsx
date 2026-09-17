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
    const [localIsFavorite, setLocalIsFavorite] = useState<boolean | null>(null);
    const [isPending, startTransition] = useTransition();

    const isFavorite = localIsFavorite ?? initialIsFavorite;

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (isPending) return;

        startTransition(async () => {
            const result = await toggleFavorite(listingId, isFavorite);

            if (result.isFavorite !== undefined) {
                setLocalIsFavorite(result.isFavorite);
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