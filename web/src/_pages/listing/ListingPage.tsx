import Link from "next/link";
import { Suspense } from "react";

import { listingApi } from "@/entities/listing/api";
import type { PublicListingType } from "@/entities/listing/types";
import { AgentPhone } from "@/entities/listing/ui/AgentPhone";
import { FavoriteButton } from "@/entities/listing/ui/FavoriteButton";
import { ListingCard } from "@/entities/listing/ui/ListingCard";
import { ListingGallery } from "@/entities/listing/ui/ListingGallery";
import { BusyViewingTimes } from "@/entities/listing/ui/BusyViewingTimes";
import { BusyViewingTimesSkeleton } from "@/entities/listing/ui/BusyViewingTimesSkeleton";
import { ViewingRequestForm } from "@/features/viewing-request/ViewingRequestForm";
import { RecentlyViewedTracker } from "@/features/recently-viewed/RecentlyViewedTracker";
import { formatArea, formatDateFull, formatPrice, formatPricePerMeter } from "@/shared/lib/format";

import styles from "./ListingPage.module.css";

type Props = {
    listing: PublicListingType;
};

const propertyTypeLabels = {
    flat: "Квартира",
    house: "Дом",
    room: "Комната",
    commercial: "Коммерческая недвижимость",
};

export async function ListingPage({ listing }: Props) {
    const isRent = listing.dealType === "rent";

    const price = Number(listing.price);

    const similarListings = await listingApi.getListingsWithMeta({
        districtId: listing.district.id,
        dealType: listing.dealType,
        priceMin: Math.round(price * 0.67),
        priceMax: Math.round(price * 1.33),
        limit: 4,
    });

    const similar = similarListings.items
        .filter((item) => item.id !== listing.id)
        .slice(0, 3);

    return (
        <section className={`container ${styles.page}`}>
            <RecentlyViewedTracker listingId={listing.id} />
            <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
                <Link href="/">Главная</Link>
                <span>→</span>
                <Link href="/listings">Каталог</Link>
                <span>→</span>
                {/* TODO: добавить ссылку, когда будут районы */}
                <span>{listing.district.title}</span>
                <span>→</span>
                <span>Объявление</span>
            </nav>

            <header className={styles.header}>
                <h2>{listing.title}</h2>
                <p>{listing.address}, {listing.district.title}</p>
            </header>

            <div className={styles.main}>
                <div className={styles.gallery}>
                    <ListingGallery photos={listing.photos} />
                </div>

                <aside className={styles.summary}>
                    <strong className={styles.price}>{formatPrice(listing.price, isRent)}</strong>
                    <span className={styles.pricePerMeter}>{formatPricePerMeter(listing.price, listing.area)}</span>
                    <Link href="#viewing" className={styles.viewingButton}>Записаться на просмотр</Link>
                    <FavoriteButton />
                    <p>Свяжитесь с агентом, чтобы уточнить детали и выбрать удобное время просмотра.</p>
                </aside>
            </div>

            <section className={styles.section}>
                <h2>Характеристики</h2>

                <dl className={styles.characteristics}>
                    <div>
                        <dt>Тип сделки</dt>
                        <dd>{isRent ? "Аренда" : "Продажа"}</dd>
                    </div>
                    <div>
                        <dt>Тип недвижимости</dt>
                        <dd>{propertyTypeLabels[listing.propertyType]}</dd>
                    </div>
                    <div>
                        <dt>Площадь</dt>
                        <dd>{formatArea(listing.area)}</dd>
                    </div>
                    <div>
                        <dt>Комнаты</dt>
                        <dd>{listing.rooms ?? "—"}</dd>
                    </div>
                    <div>
                        <dt>Этаж</dt>
                        <dd>{listing.floor != null ? `${listing.floor}${listing.totalFloors != null ? ` из ${listing.totalFloors}` : ""}` : "—"}</dd>
                    </div>
                    <div>
                        <dt>Опубликовано</dt>
                        <dd>{formatDateFull(listing.publishedAt)}</dd>
                    </div>
                </dl>
            </section>

            {listing.description && (
                <section className={styles.section}>
                    <h3>Описание</h3>
                    <p className={styles.description}>{listing.description}</p>
                </section>
            )}

            <section className={styles.section}>
                <h2>Агент</h2>

                <div className={styles.agent}>
                    <div>
                        <strong>{listing.agent.name}</strong>
                        <p>Агент</p>
                    </div>

                    <AgentPhone agentId={listing.agent.id} />
                </div>
            </section>

            <Suspense fallback={<BusyViewingTimesSkeleton />}>
                <BusyViewingTimes listingId={listing.id} />
            </Suspense>

            <section id="viewing" className={styles.section}>
                <h2>Записаться на просмотр</h2>
                <ViewingRequestForm />
            </section>

            {similar.length > 0 && (
                <section className={styles.section}>
                    <h2>Похожие объявления</h2>
                    <div className={styles.similarListings}>
                        {similar.map((item) => (<ListingCard key={item.id} listing={item} />))}
                    </div>
                </section>
            )}
        </section>
    );
}