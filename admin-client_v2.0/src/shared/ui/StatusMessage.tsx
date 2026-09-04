import styles from './StatusMessage.module.css';
import type { ReactNode } from 'react';

type StatusMessageProps = { children: ReactNode };

export default function StatusMessage({ children }: StatusMessageProps) {
    return <div className={styles.statusMessage}>{children}</div>;
}