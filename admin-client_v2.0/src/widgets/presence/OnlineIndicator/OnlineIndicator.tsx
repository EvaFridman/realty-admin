import { useState, type ReactNode } from 'react';

import { useOnlineUsers } from '@/features/presence';

import styles from './OnlineIndicator.module.css';

export default function OnlineIndicator(): ReactNode {
    const [isOpen, setIsOpen] = useState(false);
    const onlineUsers = useOnlineUsers();

    return (
        <div className={styles.wrapper} onMouseEnter={() => { setIsOpen(true) }} onMouseLeave={() => { setIsOpen(false) }}>
            <span className={styles.count}>{String(onlineUsers.length)} онлайн</span>
            {isOpen && (
                <ul className={styles.popup}>
                    {onlineUsers.map((user) => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}