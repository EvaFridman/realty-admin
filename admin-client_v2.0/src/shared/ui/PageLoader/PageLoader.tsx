import type { ReactNode } from 'react';

import styles from './PageLoader.module.css';

export default function PageLoader(): ReactNode {
    return <div className={styles.loader}></div>;
}