import 'server-only';
import { cookies } from 'next/headers';
import { ApiError } from './errors';

type RequestOptionsType = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
    headers?: Record<string, string>;
    next?: RequestInit['next'];
};

export async function apiFetch<T>(path: string, options: RequestOptionsType = {}): Promise<T> {
    const baseUrl = process.env.API_URL;

    let url = `${baseUrl}${path}`;
    if (options.query) {
        const searchParams = new URLSearchParams();
        Object.entries(options.query).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) url += `?${queryString}`;
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers };

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;
        if (token) headers['Authorization'] = `Bearer ${token}`;
    } catch { }

    const config: RequestInit = {
        method: options.method ?? 'GET',
        headers,
        next: options.next,
    };

    if (options.body !== undefined) config.body = JSON.stringify(options.body);

    const response = await fetch(url, config);

    if (!response.ok) {
        try {
            const errorResult = await response.json();
            if (errorResult?.error) {
                throw new ApiError(
                    response.status,
                    errorResult.error.message,
                    errorResult.error.details || null,
                    errorResult.error.code || null
                );
            }
        } catch (error) {
            if (error instanceof ApiError) throw error;
        }

        throw new ApiError(response.status, `Error! Status: ${response.status}`);
    }

    const result = await response.json();

    if (result && typeof result === 'object' && 'error' in result && result.error) {
        throw new ApiError(
            400,
            result.error.message,
            result.error.details || null,
            result.error.code || null
        );
    }

    return result.data as T;
}