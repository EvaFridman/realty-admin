import axios from 'axios';
import { getAccessToken } from './tokenStore.js'

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
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

api.interceptors.response.use(
    (response) => { return response.data },
    (error) => { return Promise.reject(error) }
);