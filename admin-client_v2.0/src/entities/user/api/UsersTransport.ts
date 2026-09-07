import type { UserType } from '@/entities/user/';

import { api , Transport, type ApiResponseType } from '@/shared/api';

type UploadAvatarOptionsType = {
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
};

export class UsersTransport extends Transport {
    constructor() { super("users"); }

    uploadAvatar(id: number, files: File[], { onProgress, signal }: UploadAvatarOptionsType = {}): Promise<UserType> {
        const form = new FormData();
        
        const file = files[0];

        if (file) {
            form.append('avatar', file);
        }

        return api({
            url: `/users/${String(id)}/avatar`,
            method: "POST",
            data: form,
            onUploadProgress: (event) => {
                onProgress?.(Math.round((event.progress ?? 0) * 100));
            },
            ...(signal !== undefined && { signal }),
        });
    }

    removeAvatar(id: number): Promise<ApiResponseType<UserType | undefined>> {
        return this.request<UserType | undefined>(`/${String(id)}/avatar`, { method: "DELETE" });
    }
}

export const usersTransport = new UsersTransport();