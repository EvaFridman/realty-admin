import type { ChangeEvent, ReactNode } from 'react';

import { viewingStatusLabels } from '@/entities/viewing';

import type { ViewingSearchParamsType } from '@/shared/utils/parseViewingSearchParams';

import styles from './ViewingFilterPanel.module.css';

type Props = {
    filters: ViewingSearchParamsType;
    onFieldChange: (name: string, value: string) => void;
};

export default function ViewingFilterPanel({ filters, onFieldChange }: Props): ReactNode {
    function handleChange(e: ChangeEvent<HTMLSelectElement>): void {
        onFieldChange(e.target.name, e.target.value);
    }

    return (
        <div className={styles.viewingsFilterPanel}>
            <select name="status" value={filters.status} onChange={handleChange}>
                <option value="">Статус: любой</option>
                {Object.entries(viewingStatusLabels).map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
            </select>

            <select name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
                <option value="desc">Сначала новые</option>
                <option value="asc">Сначала старые</option>
            </select>
        </div>
    );
}