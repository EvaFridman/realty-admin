import { Transport } from './transport';
import { api } from './client';

export class UsersTransport extends Transport {
    constructor() { super("users"); }
    uploadAvatar(id, files, { onProgress, signal } = {})  {
        const form = new FormData();
        form.append("avatar", files);
        return api.post(`/users/${id}/avatar`, form, {
            onUploadProgress: (event) => onProgress?.(Math.round((event.progress ?? 0) * 100)),
            signal,
        });
    }

    removeAvatar(id) { return this.remove(id, '/avatar'); }
}

export const usersTransport = new UsersTransport();