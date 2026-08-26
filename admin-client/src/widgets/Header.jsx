import styles from './Header.module.css';
import SectionSwitcher from "../features/navigation/SectionSwitcher.jsx";
import { useAuth } from '../api/auth/useAuth.js';
import { getUrl } from '../shared/utils/safeUrl';
import OnlineIndicator from './OnlineIndicator.jsx';
import ConnectionStatus from './ConnectionStatus.jsx';

export default function Header() {
    const { user } = useAuth();
    const secureAvatarUrl = getUrl(user?.avatarUrl) || '/default-avatar.png';

    return (
        <header className={styles.header}>
            <div className={styles.logoSection}>
                <h1>Админ-панель</h1>
                {user && (
                    <div className={styles.userInfo}>
                        <img src={secureAvatarUrl} alt="Аватар" className={styles.avatar} />
                        <span className={styles.username}>{user.name}</span>
                    </div>
                )}
            </div>
            <ConnectionStatus />
            <OnlineIndicator />
            <SectionSwitcher />
        </header>
    )
}