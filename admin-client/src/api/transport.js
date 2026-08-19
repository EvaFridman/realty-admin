import { api } from './client';

export class Transport {
    constructor(resource = "") { this.resource = resource }

    async request(path = "", { method = "GET", body, query, signal } = {}) {
        return api({
            url: `${this.resource}${path}`,
            method,
            params: query,
            data: body,
            signal,
        });
    }

    list(query, options = {}) { return this.request('', { query, ...options }) }
    getById(id, subpath = '', options = {}) { return this.request(`/${id}${subpath}`, options) }
    create(body, subpath = '') { return this.request(`${subpath}`, { method: "POST", body }) }
    update(id, body, subpath = '') { return this.request(`/${id}${subpath}`, { method: "PUT", body }) }
    patchSubresource(id, subpath = '', body) { return this.request(`/${id}${subpath}`, { method: 'PATCH', body }) }
    getSubresource(id, subpath, options = {}) { return this.request(`/${id}${subpath}`, options) }
    remove(id, subpath = '') { return this.request(`/${id}${subpath}`, { method: "DELETE" }) }
}