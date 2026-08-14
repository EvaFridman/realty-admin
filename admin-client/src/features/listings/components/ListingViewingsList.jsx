import styles from './ListingViewingsList.module.css';
import { useState, useEffect } from 'react';
import { listingsApi } from '../../../api/resources.js';
import StatusMessage from '../../../components/common/StatusMessage.jsx';

export default function ListingViewingsList({ listingId }) {
    const [viewings, setViewings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            setError(null);
            try {
                const json = await listingsApi.getSubresource(listingId, '/viewings');
                setViewings(json.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, [listingId]);

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
                            <span>{viewing.visitorName ?? `Заявка №${viewing.id}`}</span>
                            <span className={styles.viewingStatus}>{viewing.status}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}