import styles from './ListingViewingsList.module.css';
import { viewingStatusLabels } from '../../../constants/adminData';
import { listingsApi } from '../../../api/resources.js';
import StatusMessage from '../../../components/common/StatusMessage.jsx';
import useFetch from '../../../hooks/useFetch';

export default function ListingViewingsList({ listingId }) {
    const { data, isLoading, error } = useFetch((signal) => listingsApi.getSubresource(listingId, '/viewings', { signal }), [listingId]);
    const viewings = data?.data ?? [];

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
                            <span>{viewing.clientName ?? `Заявка №${viewing.id}`}</span>
                            <span className={styles.viewingStatus}>{viewingStatusLabels[viewing.status]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}