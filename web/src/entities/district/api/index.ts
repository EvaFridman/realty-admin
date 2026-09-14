import { apiFetch } from '@/shared/api/api-fetch';
import { PublicDistrictsResponse } from '../types';

export const districtApi = {
    getDistricts(query?: Record<string, string | number | boolean | undefined>) {
        return apiFetch<PublicDistrictsResponse>('/public/districts', { query });
    },
};