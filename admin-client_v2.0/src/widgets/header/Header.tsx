import type { ReactNode } from 'react';

import { useAuth } from '@/features/auth';

import { getUrl } from '@/shared/utils/safeUrl';

import SectionSwitcher from '../navigation/SectionSwitcher';
import ConnectionStatus from '../presence/ConnectionStatus/ConnectionStatus';
import OnlineIndicator from '../presence/OnlineIndicator/OnlineIndicator';

import styles from './Header.module.css';

export default function Header(): ReactNode {
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.logoSection}>
                <h1>Админ-панель</h1>

                {user && (
                    <div className={styles.userInfo}>
                        <img src={getUrl(user.avatarUrl) || '/default-avatar.png'} alt="Аватар" className={styles.avatar}/>
                    </div>
                )}
            </div>

            <ConnectionStatus />
            <OnlineIndicator />
            <SectionSwitcher />
        </header>
    );
}