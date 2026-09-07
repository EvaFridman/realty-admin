import axios from 'axios';
import type { ReactNode } from 'react';

import { useAuth } from '@/features/auth';

import { ListingsTransport } from '@/entities/listing';
import type { ListingPhotoType } from '@/entities/listing-photo';
import { PhotoGallery } from '@/entities/listing-photo';

import type { ApiResponseType } from '@/shared/api';
import { useAlert } from '@/shared/context/AlertContext';
import { useServiceWorkerImageReload } from '@/shared/hooks/useServiceWorkerImageReload';
import ImageUploader from '@/shared/ui/ImageUploader/ImageUploader';


import styles from './ListingPhotoManagement.module.css';

const listingsTransport = new ListingsTransport();

type Props = {
    listingId: number;
    listingAgentId: number;
    photos: ListingPhotoType[];
    onChange: () => void;
};

export default function ListingPhotoManagement({ listingId, listingAgentId, photos, onChange }: Props): ReactNode {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const imageReloadKey = useServiceWorkerImageReload();

    const canEdit = user?.role === 'moderator' || user?.id === listingAgentId;

    async function remove(photoId: number): Promise<void> {
        try {
            await listingsTransport.removePhoto(listingId, photoId);
            onChange();
        } catch (error: unknown) {
            if (axios.isAxiosError<ApiResponseType>(error)) {
                if (error.response?.status === 204 || !error.response) {
                    onChange();
                    return;
                }
                const message = error.response.data.error?.message ?? error.message;
                showAlert(`Не удалось удалить фото: ${message}`);
                return;
            }
        
            if (error instanceof Error) {
                showAlert(`Не удалось удалить фото: ${error.message}`);
                return;
            }
        
            showAlert('Не удалось удалить фото');
        }
    }

    async function makeCover(photoId: number): Promise<void> {
        try {
            await listingsTransport.setCoverPhoto(listingId, photoId);
            onChange();
        } catch (error: unknown) {
            const message =error instanceof Error ? error.message : 'Неизвестная ошибка';
            showAlert(`Не удалось установить обложку: ${message}`);
        }
    }

    return (
        <div className={styles.galleryContainer}>
            <PhotoGallery photos={photos} canEdit={canEdit} imageReloadKey={imageReloadKey} onRemove={(photoId) => { void remove(photoId) }} onMakeCover={(photoId) => { void makeCover(photoId) }}/>

            {canEdit && (
                <div className={styles.uploaderSection}>
                    <p className={styles.uploaderTitle}>Загрузить новые фотографии:</p>
                    <ImageUploader
                        upload={(files, options) => listingsTransport.uploadPhotos(listingId, files, options) }
                        onDone={onChange}
                    />
                </div>
            )}
        </div>
    );
}