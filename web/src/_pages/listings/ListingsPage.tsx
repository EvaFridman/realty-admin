import Link from "next/link";

import { districtApi } from "@/entities/district/api";
import { listingApi } from "@/entities/listing/api";
import { ListingCard } from "@/entities/listing/ui/ListingCard";
import { Pagination } from "@/shared/ui";
import { ListingFilterPanel } from "@/features/listing-filter/catalog/ListingsFilter";
import { ListingSort } from "@/features/listing-filter/catalog/ListingSort";
import { ListingViewSwitcher } from "@/entities/listing/ui/ListingViewSwitcher";
import styles from "./ListingsPage.module.css";

type SearchParams = Record<string, string | string[] | undefined>;

type Props = {
    searchParams: SearchParams;
    lockedDistrictId?: number;
    lockedDistrict?: {
        title: string;
        city: string;
    };
};

function getStringParam(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

function getArrayParam(value: string | string[] | undefined): string[] {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
}

export async function ListingsPage({ searchParams, lockedDistrictId, lockedDistrict }: Props) {
    const page = Number(getStringParam(searchParams.page)) || 1;
    const view = getStringParam(searchParams.view) === "list" ? "list" : "grid";
    const rooms = getArrayParam(searchParams.rooms);
    const districtId = lockedDistrictId ?? getStringParam(searchParams.districtId);

    const query = {
        page,
        limit: 20,
        dealType: getStringParam(searchParams.dealType),
        propertyType: getStringParam(searchParams.propertyType),
        districtId,
        rooms,
        priceMin: getStringParam(searchParams.priceMin),
        priceMax: getStringParam(searchParams.priceMax),
        areaMin: getStringParam(searchParams.areaMin),
        areaMax: getStringParam(searchParams.areaMax),
        search: getStringParam(searchParams.search),
        sortBy: getStringParam(searchParams.sortBy) ?? "publishedAt",
        sortOrder: getStringParam(searchParams.sortOrder) ?? "desc",
    };

    const [result, districts] = await Promise.all([
        listingApi.getListingsWithMeta(query),
        districtApi.getDistricts({ page: 1, limit: 20 }),
    ]);

    return (
        <section className={`container ${styles.page}`}>
            <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
                <Link href="/">Главная</Link>
                <span>→</span>
                <Link href="/listings">Каталог</Link>
                {lockedDistrict && (
                    <>
                        <span>→</span>
                        <span>{lockedDistrict.title}</span>
                    </>
                )}
            </nav>

            <header className={styles.header}>
                <h1>{lockedDistrict ? `${lockedDistrict.title}, ${lockedDistrict.city}` : "Продажа и аренда жилья"}</h1>
                <p>Квартиры, дома и комнаты от собственников и агентств.</p>
            </header>

            <div className={styles.content}>
                <ListingFilterPanel districts={districts} lockedDistrictId={lockedDistrictId} />

                <div className={styles.results}>
                    <div className={styles.resultsHeader}>
                        <div className={styles.count}>
                            Найдено: <strong>{result.meta.total}</strong>
                        </div>

                        <div className={styles.controls}>
                            <ListingSort />
                            <ListingViewSwitcher view={view} />
                        </div>
                    </div>

                    {result.items.length > 0 ? (
                        <div className={view === "list" ? styles.listingsList : styles.listings}>
                            {result.items.map((listing) => (<ListingCard key={listing.id} listing={listing} variant={view === "list" ? "row" : "tile"} />))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <h2>Ничего не найдено</h2>
                            <p>Попробуйте изменить параметры поиска или сбросить фильтры.</p>
                        </div>
                    )}

                    <Pagination currentPage={result.meta.page} totalPages={result.meta.totalPages} searchParams={searchParams} />
                </div>
            </div>
        </section>
    );
}