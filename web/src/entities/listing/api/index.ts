import { apiFetch, apiFetchWithMeta } from "@/shared/api/api-fetch";
import type { PublicListingType, ListingsApiResponseType } from "../types";

type ListingQueryType = Record<string, string | number | boolean | string[] | number[] | undefined>;

export const listingApi = {
    getListings(query?: ListingQueryType) {
        return apiFetch<PublicListingType[]>("/public/listings", { query });
    },

    async getListingsWithMeta(query?: ListingQueryType) {
        const result = await apiFetchWithMeta<ListingsApiResponseType>("/public/listings", { query, next: { revalidate: 3600, tags: ["listings"] } });
        return { items: result.data, meta: result.meta };
    },

    getListingById(id: string | number) {
        return apiFetch<PublicListingType>(`/public/listings/${String(id)}`);
    },

    getAgentPhone(id: number | string) {
        return apiFetch<{ phone: string | null }>(`/public/agents/${String(id)}/phone`);
    },
};