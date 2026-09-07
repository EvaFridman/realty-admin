import type { ReactNode } from 'react';

import { getUrl } from '@/shared/utils';

import type { ListingPhotoType } from '../index';

import styles from './PhotoGallery.module.css';

type Props = {
    photos: ListingPhotoType[];
    canEdit: boolean;
    imageReloadKey: number;
    onRemove: (photoId: number) => void;
    onMakeCover: (photoId: number) => void;
};

export default function PhotoGallery({ photos, canEdit, imageReloadKey, onRemove, onMakeCover }: Props): ReactNode {
    return (
        <div className={styles.galleryContainer}>
            <div className={styles.photosContainer}>
                {photos.length === 0 ? (
                    <p className={styles.emptyMessage}>Фотографий нет</p>
                ) : (
                    photos.map((photo) => {
                        const figureClassName = [styles.figure, photo.isCover ? styles.cover : ''].filter(Boolean).join(' ');
                        const urlOrPath = photo.externalUrl ?? (photo.fileName ? `/uploads/photos/${photo.fileName}` : null);
                        const secureUrl = getUrl(urlOrPath);
                        const imageUrl = secureUrl ? `${secureUrl}${secureUrl.includes('?') ? '&' : '?'}sw=${String(imageReloadKey)}` : null;
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
                                            <button className={styles.button} onClick={() => { onMakeCover(photo.id); }}>
                                                Сделать обложкой
                                            </button>
                                        )}
                                        <button className={styles.deleteBtn} onClick={() => { onRemove(photo.id); }}>Удалить</button>
                                    </div>
                                )}
                            </figure>
                        );
                    })
                )}
            </div>
        </div>
    );
}