import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

import { getAccessToken, setAccessToken } from './tokenStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RefreshResponse = { data: { accessToken: string } };

type AuthFailureHandler = () => void;

const axiosApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

export const refreshClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

axiosApi.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let onAuthFailure: AuthFailureHandler | null = null;

export const setAuthFailureHandler = (fn: AuthFailureHandler | null): void => { onAuthFailure = fn };

let refreshPromise: Promise<AxiosResponse<RefreshResponse>> | null = null;

export async function refreshTokens(): Promise<RefreshResponse> {
    try {
        refreshPromise = refreshPromise ?? refreshClient.post<RefreshResponse>('/auth/refresh');
        const response = await refreshPromise;
        return response.data;
    } catch (error) {
        setAccessToken(null);
        onAuthFailure?.();
        throw error;
    } finally {
        refreshPromise = null;
    }
}

axiosApi.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const original = error.config;
        if (!original) return Promise.reject(error);
        const isFormData = original.data instanceof FormData;
        const needRefresh = error.response?.status === 401 && !original._retry && !isFormData;
        if (!needRefresh) return Promise.reject(error);

        original._retry = true;

        try {
            const envelope = await refreshTokens();
            const token = envelope.data.accessToken;

            setAccessToken(token);

            original.headers.Authorization = `Bearer ${token}`;
            return axiosApi(original);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);

export function api<TResponse = unknown>(config: AxiosRequestConfig): Promise<TResponse> {
    return axiosApi(config) as unknown as Promise<TResponse>;
}