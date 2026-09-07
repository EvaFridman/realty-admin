import type { ReactNode } from 'react';

import type { ViewingType } from '@/entities/viewing';
import { viewingStatusLabels } from '@/entities/viewing';

import { Transport } from '@/shared/api/transport';
import useFetch from '@/shared/hooks/useFetch';
import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';

import styles from './ListingViewingsList.module.css';

const listingsTransport = new Transport('/listings');

type Props = { listingId: number };

export default function ListingViewingsList({ listingId }: Props): ReactNode {
    const { data, isLoading, error } = useFetch<ViewingType[]>((signal) => listingsTransport.getSubresource<ViewingType[]>(listingId, '/viewings', { signal }), [listingId]);
    const viewings = data ?? [];

    return (
        <div className={styles.viewingsContainer}>
            <p className={styles.title}>Заявки на просмотр</p>
            {isLoading && <StatusMessage>Загрузка…</StatusMessage>}
            {!isLoading && error && <StatusMessage>Ошибка: {error}</StatusMessage>}
            {!isLoading && !error && viewings.length === 0 && <StatusMessage>Заявок нет</StatusMessage>}
            {!isLoading && !error && viewings.length > 0 && (
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