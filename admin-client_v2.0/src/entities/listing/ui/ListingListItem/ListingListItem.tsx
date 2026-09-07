import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';

import { listingStatusLabels } from '../../model/constants';
import type { ListingType } from '../../model/model';

import styles from './ListingListItem.module.css';

type Props = { listing: ListingType };


export default function ListingListItem({ listing }: Props): ReactNode {
  const location = useLocation();

  return (
    <Link className={styles.item} to={`/listings/${String(listing.id)}`} state={{ from: location }}>
      <p className={styles.title}>{listing.title}</p>
      <p className={styles.meta}>{listing.address}, {listingStatusLabels[listing.status]}</p>
    </Link>
  );
}