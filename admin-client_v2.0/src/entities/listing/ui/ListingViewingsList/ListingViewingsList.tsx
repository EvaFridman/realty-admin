import type { ReactNode } from 'react';

import type { ViewingType } from '@/entities/viewing';
import { viewingStatusLabels } from '@/entities/viewing';

import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';

import styles from './ListingViewingsList.module.css';

type Props = { viewings: ViewingType[] };

export default function ListingViewingsList({ viewings }: Props): ReactNode {
    return (
        <div className={styles.viewingsContainer}>
            <p className={styles.title}>Заявки на просмотр</p>
            {viewings.length === 0 ? (<StatusMessage>Заявок нет</StatusMessage>
            ) : (
                <div className={styles.viewingsList}>
                    {viewings.map((viewing) => (
                        <div key={viewing.id} className={styles.viewing}>
                            <span>{viewing.clientName}</span>
                            <span className={styles.viewingStatus}>{viewingStatusLabels[viewing.status]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}