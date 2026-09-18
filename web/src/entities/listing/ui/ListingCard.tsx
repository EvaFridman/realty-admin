"use client";

import Link from "next/link";
import Image from "next/image";

import styles from "./ListingCard.module.css";

import type { PublicListingType } from "../types";
import { formatArea, formatDateShort, formatListingFeatures, formatPrice } from "@/shared/lib/format";
import { getUrl } from "@/shared/utils/safeUrl";
import { FavoriteButton } from "../../favorites/FavoriteButton";

type Props = {
    listing: PublicListingType;
    variant?: "tile" | "row";
    isFavorite?: boolean;
    onFavoriteChange?: (isFavorite: boolean) => void;
};

function getPhoto(listing: PublicListingType) {
    return listing.photos.find((photo) => photo.isCover) ?? listing.photos[0];
}

export function ListingCard({ listing, variant = "tile", isFavorite = false, onFavoriteChange }: Props) {
    const photo = getPhoto(listing);
    const photoUrl = getUrl(photo?.externalUrl ?? null);
    const features = formatListingFeatures(listing.rooms, listing.floor, listing.totalFloors);

    return (
        <Link href={`/listings/${listing.id}`} className={styles[variant]}>
            <div className={styles.image}>
                {photoUrl ? (
                    <Image src={photoUrl} alt={listing.title} fill/>
                ) : (
                    <div className={styles.placeholder}>
                        <span className={styles.house}>⌂</span>
                        <span>нет фото</span>
                    </div>
                )}

                <FavoriteButton listingId={listing.id} isFavorite={isFavorite} onChange={onFavoriteChange}/>

                {listing.photos.length > 0 && (<span className={styles.photoCount}>фото {listing.photos.length} шт.</span>)}
            </div>

            <section className={styles.info}>
                <strong className={styles.price}>
                    {formatPrice(listing.price, listing.dealType === "rent")}
                </strong>

                <h3 className={styles.title}>{listing.title}</h3>

                <p className={styles.details}>
                    {features.join(" · ")} · {formatArea(listing.area)}
                </p>

                <div className={styles.meta}>
                    <span>{listing.district.title}, {listing.address}</span>
                    <time dateTime={listing.publishedAt}>
                        {formatDateShort(listing.publishedAt)}
                    </time>
                </div>
            </section>
        </Link>
    );
}