import type { ReactNode } from 'react';

import { viewingStatusLabels } from '../model/constants';
import type { ViewingListItemType, ViewingStatusType } from '../model/model';

import styles from './ViewingListItem.module.css';

const getFormatKey = (status: string) => status.toLowerCase().replace('_', ' ');

type Props = {
    viewing: ViewingListItemType;
    onTransition: (viewingId: number, status: ViewingStatusType) => void;
};

export default function ViewingListItem({ viewing, onTransition }: Props): ReactNode {
    return (
        <div className={[styles.viewingCard,viewing._pending && styles.pending].filter(Boolean).join(' ')}>
            <div className={styles.cardHeader}>
                <p className={styles.client}>{viewing.clientName}</p>
                <span className={styles.status}>{viewingStatusLabels[viewing.status]}</span>
            </div>

            <p className={styles.listingLine}>{viewing.listing?.title}, {viewing.listing?.address}</p>

            {viewing.allowedTransitions.length > 0 ? (
                <div className={styles.viewingCardActions}>
                    {viewing.allowedTransitions.map((status) => (
                        <button key={status} type="button" disabled={viewing._pending} onClick={() => { onTransition(viewing.id, status); }}>
                            {viewingStatusLabels[getFormatKey(status) as keyof typeof viewingStatusLabels] || status}
                        </button>
                    ))}
                </div>
            ) : (
                <p className={styles.finalNote}>Заявка закрыта, дальнейшие действия недоступны</p>
            )}
        </div>
    );
}