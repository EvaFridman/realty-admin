import styles from './Pagination.module.css';

type PaginationProps = { page: number; totalPages: number; onPageChange: (page: number) => void };

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className={styles.pagination}>
            <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>назад</button>
            <span className={styles.label}>страница {page} из {totalPages}</span>
            <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>вперёд</button>
        </div>
    );
}