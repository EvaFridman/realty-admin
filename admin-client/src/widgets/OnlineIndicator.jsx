import { useState } from 'react';
import styles from './OnlineIndicator.module.css';

export default function OnlineIndicator({ users }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.wrapper} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <span className={styles.count}>{users.length} онлайн</span>
            {isOpen && (
                <ul className={styles.popup}>
                    {users.map((u) => (
                        <li key={u.id}>{u.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}