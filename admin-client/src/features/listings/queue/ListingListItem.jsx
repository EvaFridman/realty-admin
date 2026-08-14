import styles from './ListingListItem.module.css';
import { listingStatusLabels } from '../../data/adminData';

export default function ListingListItem({ listing, isActive, onSelect }) {
  return (
    <button type="button" className={isActive ? styles.itemActive : styles.item} onClick={() => onSelect(listing.id)}>
      <p className={styles.title}>{listing.title}</p>
      <p className={styles.meta}>{listing.address}, {listingStatusLabels[listing.status]}</p>
    </button>
  );
}