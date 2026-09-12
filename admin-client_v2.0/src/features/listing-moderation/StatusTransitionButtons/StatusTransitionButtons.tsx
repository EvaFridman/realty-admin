import type { ReactNode } from 'react';

import { listingStatusLabels, type ListingStatusType } from '@/entities/listing';

import styles from './StatusTransitionButtons.module.css';

type Props = {
    allowedTransitions: ListingStatusType[];
    onTransition: (status: ListingStatusType) => void;
};

export default function StatusTransitionButtons({ allowedTransitions, onTransition }: Props): ReactNode {
  if (allowedTransitions.length === 0) {
    return <p className={styles.noTransitions}>Дальнейшие переходы недоступны</p>;
  }

  return (
    <div className={styles.btns}>
      {allowedTransitions.map((status) => (<button key={status} type="button" onClick={() => { onTransition(status); }}>{listingStatusLabels[status.toLowerCase() as keyof typeof listingStatusLabels] || status}</button>))}</div>
  );
}