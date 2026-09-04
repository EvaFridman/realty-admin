import type { AxiosRequestConfig } from 'axios';

import { api } from './client';
import type { ApiResponse } from './types';

type RequestOptions = {
    method?: AxiosRequestConfig['method'];
    body?: AxiosRequestConfig['data'];
    query?: AxiosRequestConfig['params'];
    signal?: AbortSignal;
};

export class Transport {
    private readonly resource: string;
    constructor(resource = "") { this.resource = resource }

    async request<TResponse = unknown>(path = "", { method = "GET", body, query, signal }: RequestOptions = {}): Promise<ApiResponse<TResponse>> {
        return api<ApiResponse<TResponse>>({
            url: `${this.resource}${path}`,
            method,
            ...(query !== undefined && { params: query }),
            ...(body !== undefined && { data: body }),
            ...(signal !== undefined && { signal }),
        });
    }

    list<TResponse = unknown>(query?: AxiosRequestConfig['params'], options: RequestOptions = {}) {
        return this.request<TResponse>('', { ...options, ...(query !== undefined && { query }) }) }
    getById<TResponse = unknown>(id: string | number, subpath = '', options: RequestOptions = {}) {
        return this.request<TResponse>(`/${id}${subpath}`, options) }
    create<TResponse = unknown>(body: AxiosRequestConfig['data'], subpath = '') {
        return this.request<TResponse>(`${subpath}`, { method: "POST", body }) }
    update<TResponse = unknown>(id: string | number, body: AxiosRequestConfig['data'], subpath = '') {
        return this.request<TResponse>(`/${id}${subpath}`, { method: "PUT", body }) }
    patchSubresource<TResponse = unknown>(id: string | number, subpath = '', body?: AxiosRequestConfig['data']) {
        return this.request<TResponse>(`/${id}${subpath}`, body !== undefined ? { method: 'PATCH', body } : { method: 'PATCH' }) }
    getSubresource<TResponse = unknown>(id: string | number, subpath: string, options: RequestOptions = {}) {
        return this.request<TResponse>(`/${id}${subpath}`, options) }
    remove(id: string | number, subpath = '') {
        return this.request<void>(`/${id}${subpath}`, { method: "DELETE" }) }
}