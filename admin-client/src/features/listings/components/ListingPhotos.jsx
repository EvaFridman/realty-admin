import styles from './ListingPhotos.module.css';
import PhotoGallery from './PhotoGallery';

export default function ListingPhotos({ photos, listingId, listingAgentId, onChange }) {
    return (
        <div className={styles.photosContainer}>
            <PhotoGallery 
                listingId={listingId} 
                listingAgentId={listingAgentId} 
                photos={photos} 
                onChange={onChange}
            />
        </div>
    );
}