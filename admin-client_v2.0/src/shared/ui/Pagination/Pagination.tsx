import type { ReactNode } from 'react';

import styles from './Pagination.module.css';

type Props = { page: number; totalPages: number; onPageChange: (page: number) => void };

export default function Pagination({ page, totalPages, onPageChange }: Props): ReactNode {
    if (totalPages <= 1) return null;

    return (
        <div className={styles.pagination}>
            <button type="button" onClick={() => { onPageChange(page - 1); }} disabled={page <= 1}>назад</button>
            <span className={styles.label}>страница {page} из {totalPages}</span>
            <button type="button" onClick={() => { onPageChange(page + 1); }} disabled={page >= totalPages}>вперёд</button>
        </div>
    );
}