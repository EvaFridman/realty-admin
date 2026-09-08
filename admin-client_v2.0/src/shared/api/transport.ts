import type { AxiosRequestConfig } from 'axios';

import { api } from './client';
import type { ApiResponseType } from './types';

type RequestOptionsType = {
    method?: AxiosRequestConfig['method'];
    body?: unknown;
    query?: Record<string, unknown>;
    signal?: AbortSignal;
};

export class Transport {
    private readonly resource: string;
    constructor(resource = "") { this.resource = resource }

    async request<T = unknown, TMeta = unknown>(path = "", { method = "GET", body, query, signal }: RequestOptionsType = {}): Promise<ApiResponseType<T, TMeta>> {
        return api<ApiResponseType<T, TMeta>>({
            url: `${this.resource}${path}`,
            method,
            ...(query !== undefined ? { params: query } : {}),
            ...(body !== undefined ? { data: body } : {}),
            ...(signal !== undefined ? { signal } : {}),
        });
    }

    list<T = unknown, TMeta = unknown>(query?: Record<string, unknown>, options: RequestOptionsType = {}): Promise<ApiResponseType<T, TMeta>> {
        return this.request<T, TMeta>('', { ...options, ...(query !== undefined && { query }) }) }
    getById<T = unknown, TMeta = unknown>(id: string | number, subpath = '', options: RequestOptionsType = {}): Promise<ApiResponseType<T, TMeta>> {
        return this.request<T, TMeta>(`/${String(id)}${subpath}`, options) }
    create<T = unknown, TMeta = unknown>(body: unknown, subpath = ''): Promise<ApiResponseType<T, TMeta>> {
        return this.request<T, TMeta>(subpath, { method: "POST", body }) }
    update<T = unknown, TMeta = unknown>(id: string | number, body: unknown, subpath = ''): Promise<ApiResponseType<T, TMeta>> {
        return this.request<T, TMeta>(`/${String(id)}${subpath}`, { method: "PUT", body }) }
    patchSubresource<T = unknown, TMeta = unknown>(id: string | number, subpath = '', body?: unknown): Promise<ApiResponseType<T, TMeta>> {
        return this.request<T, TMeta>(`/${String(id)}${subpath}`, body !== undefined ? { method: 'PATCH', body } : { method: 'PATCH' }) }
    getSubresource<T = unknown, TMeta = unknown>(id: string | number, subpath: string, options: RequestOptionsType = {}): Promise<ApiResponseType<T, TMeta>> {
        return this.request<T, TMeta>(`/${String(id)}${subpath}`, options) }
    remove(id: string | number, subpath = ''): Promise<ApiResponseType<null>> {
        return this.request<null>(`/${String(id)}${subpath}`, { method: "DELETE" }) }
}