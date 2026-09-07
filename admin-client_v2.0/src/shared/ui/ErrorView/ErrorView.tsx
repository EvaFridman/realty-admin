import type { ReactNode } from 'react';

import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';

import styles from './ErrorView.module.css';


type Props = { message: string; children?: ReactNode; onRetry?: () => void };

export default function ErrorView({ message, children, onRetry }: Props): ReactNode {
    return (
        <div className={styles.errorPage}>
            <StatusMessage>{message}</StatusMessage>
            {children}
            {onRetry && <button className={styles.btn} onClick={onRetry}>Повторить</button>}
        </div>
    );
}