import styles from './ListingListItem.module.css';
import { Link, useLocation } from 'react-router';
import { listingStatusLabels } from "../../../constants/adminData.js";

export default function ListingListItem({ listing }) {
  const location = useLocation();

  return (
    <Link className={styles.item} to={`/listings/${listing.id}`} state={{ from: location }}>
      <p className={styles.title}>{listing.title}</p>
      <p className={styles.meta}>{listing.address}, {listingStatusLabels[listing.status]}</p>
    </Link>
  );
}