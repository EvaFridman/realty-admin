"use client";

import styles from "./ListingCard.module.css";

{/* TODO: добавить реальную логику добавления в избранное, когда появится функционал подтягивания данных пользователя */}
export function FavoriteButton() {
    return (
        <button type="button"className={styles.favorite}aria-label="Добавить в избранное" onClick={(event) => event.preventDefault()}>♡</button>
    );
}