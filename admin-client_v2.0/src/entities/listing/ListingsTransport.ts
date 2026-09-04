import { Transport } from '@/shared/api/transport';
import { api } from '@/shared/api/client';
import type { ListingPhoto } from '@/entities/listing-photo/types';

type UploadPhotosOptions = {
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
};

export class ListingsTransport extends Transport {
    constructor() { super("listings"); }

    uploadPhotos(id: number, files: File[], { onProgress, signal }: UploadPhotosOptions = {}) {
        const form = new FormData();
        files.forEach((file) => form.append("photos", file));
        return api({
            url: `/listings/${id}/photos`,
            method: "POST",
            data: form,
            onUploadProgress: (event) => onProgress?.(Math.round((event.progress ?? 0) * 100)),
            ...(signal !== undefined && { signal }),
        });
    }

    setCoverPhoto(id: number, photoId: number) {
        return this.request < ListingPhoto > (`/${id}/photos/${photoId}/cover`, { method: "PATCH" });
    }

    removePhoto(id: number, photoId: number) {
        return this.request < void> (`/${id}/photos/${photoId}`, { method: "DELETE" });
    }
}