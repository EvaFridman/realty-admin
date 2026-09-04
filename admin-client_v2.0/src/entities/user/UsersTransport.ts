import { Transport } from '@/shared/api/transport';
import { api } from '@/shared/api/client';
import type { User } from '@/entities/user/types';

type UploadAvatarOptions = {
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
};

export class UsersTransport extends Transport {
    constructor() { super("users"); }

    uploadAvatar(id: number, files: File[], { onProgress, signal }: UploadAvatarOptions = {}) {
        const form = new FormData();
        if (files.length > 0) form.append("avatar", files[0]!);
        return api({
            url: `/users/${id}/avatar`,
            method: "POST",
            data: form,
            onUploadProgress: (event) => onProgress?.(Math.round((event.progress ?? 0) * 100)),
            ...(signal !== undefined && { signal }),
        });
    }

    removeAvatar(id: number) {
        return this.request<User | undefined>(`/${id}/avatar`, { method: "DELETE" });
    }
}

export const usersTransport = new UsersTransport();