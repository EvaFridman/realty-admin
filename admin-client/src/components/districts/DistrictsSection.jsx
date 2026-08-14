import styles from './DistrictsSection.module.css';
import { useState, useEffect } from 'react';
import { districtsApi } from '../../api/resources';
import StatusMessage from '../common/StatusMessage';

export default function DistrictsSection() {
    const [districts, setDistricts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            setError(null);
            try {
                const json = await districtsApi.list();
                setDistricts(json.data ?? []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    if (isLoading) return <StatusMessage>Загрузка…</StatusMessage>;
    if (error) return <StatusMessage>Ошибка: {error}</StatusMessage>;
    if (districts.length === 0) return <StatusMessage>Районов нет</StatusMessage>;

    return (
        <div className={styles.table}>
            <div className={styles.headersRow}>
                <span>Название</span>
                <span>Город</span>
            </div>
            {districts.map((district) => (
                <div key={district.id} className={styles.row}>
                    <span>{district.title}</span>
                    <span className={styles.city}>{district.city}</span>
                </div>
            ))}
        </div>
    );
}