import { apiFetch } from "@/shared/api/api-fetch";
import type { PublicListingType } from "../types";

export const listingApi = {
    getListings(query?: Record<string, string | number | boolean | undefined>) {
        return apiFetch<PublicListingType[]>("/public/listings", { query });
    },

    getListingById(id: string | number) {
        return apiFetch<PublicListingType>(`/public/listings/${String(id)}`);
    },
};