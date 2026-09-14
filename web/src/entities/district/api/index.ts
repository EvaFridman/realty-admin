import { apiFetch } from '@/shared/api/api-fetch';

export type PublicDistrictType = {
    id: number;
    title: string;
    city: string;
    publishedListingsCount: number;
};

export type PublicDistrictsResponse = {
    items: PublicDistrictType[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export const districtApi = {
    getDistricts(query?: Record<string, string | number | boolean | undefined>) {
        return apiFetch<PublicDistrictsResponse>('/public/districts', { query });
    },
};