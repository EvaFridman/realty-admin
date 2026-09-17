"use client";

import Image from "next/image";
import { useState } from "react";

import type { PublicViewingType } from "@/entities/viewing/types";
import { getUrl } from "@/shared/utils/safeUrl";

import styles from "./ViewingsList.module.css";

type Props = {
    viewings: PublicViewingType[];
};

const STATUS_LABELS = {
    CREATED: "Создана",
    PENDING_APPROVAL: "На согласовании",
    APPROVED: "Подтверждена",
    REJECTED: "Отклонена",
    CLOSED: "Закрыта",
} as const;

function formatViewingDate(value: string) {
    return new Date(value).toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getPhoto(viewing: PublicViewingType) {
    return viewing.listing.photos.find((photo) => photo.isCover) ?? viewing.listing.photos[0];
}

export function ViewingsList({ viewings }: Props) {
    const [openId, setOpenId] = useState<number | null>(null);

    if (viewings.length === 0) {
        return <p className={styles.empty}>Заявок пока нет</p>;
    }

    return (
        <div className={styles.list}>
            {viewings.map((viewing) => {
                const isOpen = openId === viewing.id;
                const photo = getPhoto(viewing);
                const photoUrl = getUrl(photo?.externalUrl ?? null);

                return (
                    <article key={viewing.id} className={`${styles.item} ${isOpen ? styles.open : ""}`}>
                        <button
                            type="button"
                            className={styles.header}
                            aria-expanded={isOpen}
                            onClick={() => setOpenId(isOpen ? null : viewing.id)}
                        >
                            <div className={styles.image}>
                                {photoUrl ? (
                                    <Image src={photoUrl} alt="" fill sizes="56px" />
                                ) : (
                                    <span>нет фото</span>
                                )}
                            </div>

                            <div className={styles.info}>
                                <h3>{viewing.listing.title}</h3>
                                <time dateTime={viewing.preferredAt}>
                                    {formatViewingDate(viewing.preferredAt)}
                                </time>
                            </div>

                            <span className={`${styles.status} ${styles[viewing.status]}`}>
                                {STATUS_LABELS[viewing.status]}
                            </span>
                        </button>

                        {isOpen && (
                            <div className={styles.details}>
                                <div>
                                    <span className={styles.detailTitle}>Комментарий</span>
                                    <p>{viewing.comment || "Без комментария"}</p>
                                </div>

                                <div>
                                    <span className={styles.detailTitle}>Агент</span>
                                    <p>
                                        {viewing.listing.agent.name}
                                        {viewing.listing.agent.phone && ` · ${viewing.listing.agent.phone}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </article>
                );
            })}
        </div>
    );
}