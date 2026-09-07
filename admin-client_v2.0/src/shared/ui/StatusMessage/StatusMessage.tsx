import type { ReactNode } from 'react';

import styles from './StatusMessage.module.css';

type Props = { children: ReactNode };

export default function StatusMessage({ children }: Props): ReactNode {
    return <div className={styles.statusMessage}>{children}</div>;
}