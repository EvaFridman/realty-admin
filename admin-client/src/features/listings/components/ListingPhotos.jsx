import styles from './ListingPhotos.module.css';

export default function ListingPhotos({ photos }) {
    if (!photos || photos.length === 0) {
        return <p className={styles.empty}>Фотографий нет</p>;
    }

    return (
        <div className={styles.photosContainer}>
            {photos.map((photo) => (<div key={photo.id} className={styles.photo}>{photo.isCover && <span className={styles.coverBadge}>обложка</span>}</div>))}
        </div>
    );
}