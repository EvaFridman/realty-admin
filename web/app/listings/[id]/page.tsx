import { notFound } from "next/navigation";

import { listingApi } from "@/entities/listing/api";
import { ApiError } from "@/shared/api/errors";
import { ListingPage } from "@/_pages/listing/ListingPage";
import { PublicListingType } from "@/entities/listing/types";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    let listing: PublicListingType;

    try {
        listing = await listingApi.getListingById(id);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) notFound();
        throw error;
    }

    return <ListingPage listing={listing} />;
}
