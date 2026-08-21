import styles from './Header.module.css';
import SectionSwitcher from "../features/navigation/SectionSwitcher.jsx";
import { useAuth } from '../api/auth/useAuth.js';

export default function Header() {
    const { user } = useAuth();
    const getAvatarUrl = (url) => {
        if (!url) return '/default-avatar.png';
        return url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL}${url}`;
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoSection}>
                <h1>Админ-панель</h1>
                {user && (
                    <div className={styles.userInfo}>
                        <img src={ getAvatarUrl(user.avatarUrl)} alt="Аватар" className={styles.avatar} />
                        <span className={styles.username}>{user.name}</span>
                    </div>
                )}
            </div>
            <SectionSwitcher />
        </header>
    )
}