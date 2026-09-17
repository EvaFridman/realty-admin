import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";

import { listingApi } from "@/entities/listing/api";
import { ApiError } from "@/shared/api/errors";
import { ListingPage } from "@/_pages/listing/ListingPage";
import type { PublicListingType } from "@/entities/listing/types";

type Props = {
    params: Promise<{ id: string }>;
};

const getListing = cache((id: string) => listingApi.getCachedListingById(id));

export async function generateStaticParams() {
    const listings = await listingApi.getListings({ page: 1, limit: 100, sortBy: "publishedAt", sortOrder: "desc" });
    return listings.map((listing) => ({ id: String(listing.id) }));
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    let listing: PublicListingType;

    try {
        listing = await getListing(id);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) notFound();
        throw error;
    }

    return <ListingPage listing={listing} />;
}