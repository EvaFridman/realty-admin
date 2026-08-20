import { Transport } from './transport';
import { api } from './client';

export class ListingsTransport extends Transport {
    constructor() { super("listings"); }
    uploadPhotos(id, files, { onProgress, signal } = {}) {
        const form = new FormData();
        files.forEach((file) => form.append("photos", file));
        return api.post(`/listings/${id}/photos`, form, {
            onUploadProgress: (event) => onProgress?.(Math.round((event.progress ?? 0) * 100)),
            signal,
        });
    }
    removePhoto(id, photoId) { return api.delete(`/listings/${id}/photos/${photoId}`); }
}