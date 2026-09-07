import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type AccessTokenGetterType = () => string | null;
type RefreshHandlerType = () => Promise<string>;

let getAccessToken: AccessTokenGetterType = () => null;
let refreshAccessToken: RefreshHandlerType | null = null;

export function configureApiAuth(tokenGetter: AccessTokenGetterType, refreshHandler: RefreshHandlerType): void {
    getAccessToken = tokenGetter;
    refreshAccessToken = refreshHandler;
}

const axiosApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

axiosApi.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosApi.interceptors.response.use(
    <T>(response: AxiosResponse<T>): T => response.data,
    async (error: unknown) => {
        if (!axios.isAxiosError(error)) throw error;

        const original = error.config;
        if (!original) throw error;

        const isFormData = original.data instanceof FormData;

        const needRefresh = error.response?.status === 401 && !original._retry && !isFormData;
        if (!needRefresh || !refreshAccessToken) throw error;
        original._retry = true;

        const token = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${token}`;
        
        return axiosApi(original);
    }
);

export function api<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return axiosApi(config) as unknown as Promise<T>;
}