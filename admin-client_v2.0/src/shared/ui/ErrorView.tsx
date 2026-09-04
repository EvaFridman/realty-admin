import type { ReactNode } from 'react';

import styles from './ErrorView.module.css';

import StatusMessage from '@/shared/ui/StatusMessage';

type ErrorViewProps = { message: string; children?: ReactNode; onRetry?: () => void };

export default function ErrorView({ message, children, onRetry }: ErrorViewProps) {
    return (
        <div className={styles.errorPage}>
            <StatusMessage>{message}</StatusMessage>
            {children}
            {onRetry && <button className={styles.btn} onClick={onRetry}>Повторить</button>}
        </div>
    );
}