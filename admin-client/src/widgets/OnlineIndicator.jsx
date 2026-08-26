import { useState } from 'react';
import styles from './OnlineIndicator.module.css';
import { useOnlineUsers } from '../realtime/usePresence.js';

export default function OnlineIndicator() {
    const [isOpen, setIsOpen] = useState(false);
    const onlineUsers = useOnlineUsers();

    return (
        <div className={styles.wrapper} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <span className={styles.count}>{onlineUsers.length} онлайн</span>
            {isOpen && (
                <ul className={styles.popup}>
                    {onlineUsers.map((u) => (
                        <li key={u.id}>{u.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}