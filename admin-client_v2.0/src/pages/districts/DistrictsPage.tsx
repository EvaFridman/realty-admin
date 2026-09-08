import type { ReactNode } from 'react';


import type { DistrictType } from '@/entities/district';

import { Transport } from '@/shared/api';
import useFetch from '@/shared/hooks/useFetch';
import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';

import styles from './DistrictsPage.module.css';

const districtsTransport = new Transport('districts');

export default function DistrictsPage(): ReactNode {
    const { data, isLoading, error } = useFetch(
        (signal) => districtsTransport.list<DistrictType[]>(undefined, { signal }),
        [],
    );

    const districts = data ?? [];

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