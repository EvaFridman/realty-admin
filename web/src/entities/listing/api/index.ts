import { apiFetch } from '@/shared/api/api-fetch';
import { PublicListingType, PublicListingsResponse } from '../types';


export const listingApi = {
    getListings(query?: Record<string, string | number | boolean | undefined>) {
        return apiFetch<PublicListingsResponse>('/public/listings', { query });
    },

    getListingById(id: string | number) {
        return apiFetch<PublicListingType>(`/public/listings/${String(id)}`);
    },
};