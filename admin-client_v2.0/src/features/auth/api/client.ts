import axios, { type AxiosResponse } from 'axios';

import type { ApiResponseType } from '@/shared/api';
import { configureApiAuth } from '@/shared/api/client';

import { getAccessToken, setAccessToken } from '../model/tokenStore';

type RefreshDataType = { accessToken: string };

type RefreshResponseType = ApiResponseType<RefreshDataType>;

type AuthFailureHandlerType = () => void;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const refreshClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

let refreshPromise: Promise<AxiosResponse<RefreshResponseType>> | null = null;

let onAuthFailure: AuthFailureHandlerType | null = null;

export function setAuthFailureHandler(handler: AuthFailureHandlerType | null): void {
    onAuthFailure = handler;
}

export async function refreshTokens(): Promise<RefreshResponseType> {
    try {
        refreshPromise = refreshPromise ?? refreshClient.post<RefreshResponseType>('/auth/refresh');
        const response = await refreshPromise;
        return response.data;
    } finally {
        refreshPromise = null;
    }
}

async function refreshAccessToken(): Promise<string> {
    try {
        const response = await refreshTokens();
        if (!response.data) throw new Error('Refresh response is empty');
        const token = response.data.accessToken;
        setAccessToken(token);

        return token;
    } catch (error: unknown) {
        setAccessToken(null);
        onAuthFailure?.();
        throw error;
    }
}

configureApiAuth(getAccessToken, refreshAccessToken);