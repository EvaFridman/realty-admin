import styles from './PhotoGallery.module.css';
import { useEffect, useState } from 'react';
import { useAuth } from "../../../api/auth/useAuth.js";
import { ListingsTransport } from '../../../api/ListingsTransport';
import { useAlert } from '../../../components/common/AlertContext.jsx';
import ImageUploader from '../../../components/upload/ImageUploader';
import { getUrl } from '../../../shared/utils/safeUrl';

const listingsTransport = new ListingsTransport();

export default function PhotoGallery({ listingId, listingAgentId, photos, onChange }) {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const canEdit = user?.role === "moderator" || user?.id === listingAgentId;

    const photosArray = Array.isArray(photos) ? photos : (photos?.data || []);

    const remove = async (photoId) => {
        try {
            await listingsTransport.removePhoto(listingId, photoId);
            if (typeof onChange === 'function') setTimeout(() => onChange(), 50);
        } catch (err) {
            if (err.response?.status === 204 || !err.response) {
                if (typeof onChange === 'function') setTimeout(() => onChange(), 50);
                return;
            }
            showAlert(`Не удалось удалить фото: ${err.response?.data?.error?.message || err.message}`);
        }
    };

    const makeCover = async (photoId) => {
        try {
            await listingsTransport.setCoverPhoto(listingId, photoId);
            if (typeof onChange === 'function') setTimeout(() => onChange(), 50);
        } catch (err) {
            showAlert(`Не удалось установить обложку: ${err.response?.data?.error?.message || err.message}`);
        }
    };

    const [imageReloadKey, setImageReloadKey] = useState(0);

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;
        const handleControllerChange = () => { setImageReloadKey(prev => prev + 1) };
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    
        return () => navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    }, []);
    
    return (
        <div className={styles.galleryContainer}>
            <div className={styles.photosContainer}>
                {photosArray.length === 0 ? (
                    <p className={styles.emptyMessage}>Фотографий нет</p>
                ) : (
                    photosArray.map((photo) => {
                        const figureClassName = `${styles.figure} ${photo.isCover ? styles.cover : ''}`;
                        const urlOrPath = photo.externalUrl || photo.url || (photo.fileName ? `/uploads/photos/${photo.fileName}` : null);
                        const secureUrl = getUrl(urlOrPath);
                        const imageUrl = secureUrl ? `${secureUrl}${secureUrl.includes('?') ? '&' : '?'}sw=${imageReloadKey}` : null;
                        return (
                            <figure key={photo.id} className={figureClassName}>
                                {imageUrl ? (<img src={imageUrl} alt="" loading="lazy" width={200} height={200} className={styles.image}/>
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <span>Фото недоступно</span>
                                    </div>
                                )}                                
                                {photo.isCover && (<span className={styles.coverBadge}>обложка</span>)}
                                
                                {canEdit && (
                                    <div className={styles.controls}>
                                        {!photo.isCover && (
                                            <button className={styles.button} onClick={() => makeCover(photo.id)}>
                                                Сделать обложкой
                                            </button>
                                        )}
                                        <button className={styles.deleteBtn} onClick={() => remove(photo.id)}>Удалить</button>
                                    </div>
                                )}
                            </figure>
                        );
                    })
                )}
            </div>

            {canEdit && (
                <div className={styles.uploaderSection}>
                    <p className={styles.uploaderTitle}>Загрузить новые фотографии:</p>
                    <ImageUploader 
                        upload={(files, options) => listingsTransport.uploadPhotos(listingId, files, options)} 
                        onDone={() => { if (typeof onChange === 'function') setTimeout(() => onChange(), 50); }}
                    />
                </div>
            )}
        </div>
    );
}