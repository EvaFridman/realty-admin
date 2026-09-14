import { apiFetch } from '@/shared/api/api-fetch';

export type PublicListingDealType = 'sale' | 'rent';

export type PublicListingPropertyType = 'flat' | 'house' | 'room' | 'commercial';


export type PublicPhotoType = {
    id: number;
    fileName: string;
    externalUrl: string | null;
    position: number;
    isCover: boolean;
};

export type PublicListingType = {
    id: number;
    price: number;
    area: number;
    rooms: number | null;
    floor: number | null;
    totalFloors: number | null;
    dealType: PublicListingDealType;
    propertyType: PublicListingPropertyType;
    address: string;
    publishedAt: string;
    district: { id: number; title: string };
    photos: PublicPhotoType[];
};

export type PublicListingsResponse = {
    items: PublicListingType[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export const listingApi = {
    getListings(query?: Record<string, string | number | boolean | undefined>) {
        return apiFetch<PublicListingsResponse>('/public/listings', { query });
    },

    getListingById(id: string | number) {
        return apiFetch<PublicListingType>(`/public/listings/${String(id)}`);
    },
};