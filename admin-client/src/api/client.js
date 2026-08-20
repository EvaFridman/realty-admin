import axios from 'axios';
import { getAccessToken, setAccessToken } from './tokenStore.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

export const refreshClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

let onAuthFailure = null;

export const setAuthFailureHandler = (fn) => { onAuthFailure = fn };

let refreshPromise = null;

export async function refreshTokens() {
    try {
        refreshPromise = refreshPromise ?? refreshClient.post('/auth/refresh');
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

api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const original = error.config;
        const isFormData = original?.data instanceof FormData;
        const needRefresh = error.response?.status === 401 && !original._retry && !isFormData;
        if (!original) return Promise.reject(error);
        if (!needRefresh) return Promise.reject(error);

        original._retry = true;

        try {
            const envelope = await refreshTokens();
            const token = envelope?.data?.accessToken;

            setAccessToken(token);

            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);