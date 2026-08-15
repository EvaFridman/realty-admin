import { ApiError } from './ApiError';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class Transport {
    constructor(resource = "") { this.resource = resource; }

    async request(path = "", { method = "GET", body, query, signal } = {}) {
        const queryString = query ? `?${query instanceof URLSearchParams ? query : new URLSearchParams(query)}` : '';
        const res = await fetch(`${API_BASE_URL}${this.resource}${path}${queryString}`, {
            method,
            headers: body ? { "Content-Type": "application/json" } : undefined,
            body: body ? JSON.stringify(body) : undefined,
            signal,
        });

        if (res.status === 204) return null;
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new ApiError(json?.error?.message ?? `HTTP ${res.status}`, res.status, json?.error?.details);

        return json;
    }
    list(query, options = {}) { return this.request('', { query, ...options }); }
    getById(id, subpath = '', options = {}) { return this.request(`/${id}${subpath}`, options); }
    create(body, subpath = '') { return this.request(`${subpath}`, { method: "POST", body }); }
    update(id, body, subpath = '') { return this.request(`/${id}${subpath}`, { method: "PUT", body }); }
    patchSubresource(id, subpath = '', body) { return this.request(`/${id}${subpath}`, { method: 'PATCH', body }); }
    getSubresource(id, subpath, options = {}) { return this.request(`/${id}${subpath}`, options); }
    remove(id, subpath = '') { return this.request(`/${id}${subpath}`, { method: "DELETE" }); }
}