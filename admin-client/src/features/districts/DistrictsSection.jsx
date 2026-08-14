import styles from './DistrictsSection.module.css';
import { useCallback } from 'react';
import { districtsApi } from '../../api/resources';
import StatusMessage from '../../components/common/StatusMessage';
import useFetch from '../../hooks/useFetch';

export default function DistrictsSection() {
    const fetchDistricts = useCallback((signal) => districtsApi.list(undefined, { signal }), []);
    const { data, isLoading, error } = useFetch(fetchDistricts);
    const districts = data?.data ?? [];

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