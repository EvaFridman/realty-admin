import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

import { useAuth } from '@/features/auth';

import { navItems } from '@/shared/config/navigation';
import Button from '@/shared/ui/Button/Button';

import styles from './SectionSwitcher.module.css';

export default function SectionSwitcher(): ReactNode {
    const { user, logout } = useAuth();
    const isModerator = user?.role === 'moderator';

    const visibleItems = navItems.filter((item) => !item.moderatorOnly || isModerator);

    return (
        <nav className={styles.sectionsSwitcher}>
            {visibleItems.map((item) => (
                <NavLink key={item.id} to={item.path} end={item.id === 'queue'} className={({ isActive }) => isActive ? styles.tabActive : styles.tab }>
                    {item.title}
                </NavLink>
            ))}

            <Button type="button" onClick={() => { void logout(); }}>Выйти</Button>
        </nav>
    );
}