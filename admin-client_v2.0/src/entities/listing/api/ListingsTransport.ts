import { api , Transport, type ApiResponseType } from '@/shared/api';

import type { ListingPhotoType } from '../../listing-photo/index';

type UploadPhotosOptionsType = {
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
};

export class ListingsTransport extends Transport {
    constructor() { super("listings"); }

    uploadPhotos(id: number, files: File[], { onProgress, signal }: UploadPhotosOptionsType = {}): Promise<ApiResponseType<ListingPhotoType[]>> {
        const form = new FormData();
        files.forEach((file) => { form.append("photos", file); });
        return api<ApiResponseType<ListingPhotoType[]>>({
            url: `/listings/${String(id)}/photos`,
            method: "POST",
            data: form,
            onUploadProgress: (event) => {
                onProgress?.(Math.round((event.progress ?? 0) * 100));
            },
            ...(signal !== undefined && { signal }),
        });
    }

    setCoverPhoto(id: number, photoId: number): Promise<ApiResponseType<ListingPhotoType>> {
        return this.request<ListingPhotoType>(
            `/${String(id)}/photos/${String(photoId)}/cover`,
            { method: 'PATCH' },
        );
    }
    
    removePhoto(id: number, photoId: number): Promise<unknown> {
        return api({
            url: `/listings/${String(id)}/photos/${String(photoId)}`,
            method: 'DELETE',
        });
    }
}