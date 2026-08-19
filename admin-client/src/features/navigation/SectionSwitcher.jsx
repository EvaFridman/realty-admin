import styles from './SectionSwitcher.module.css';
import { NavLink } from 'react-router';
import { navItems } from "../../constants/adminData.js";
import LogoutButton from "../../widgets/LogoutButton"
import { useAuth } from '../../api/auth/useAuth';

export default function SectionSwitcher() {
    const { user } = useAuth();
    const isModerator = user?.role === 'moderator';

    const visibleItems = navItems.filter(item => !item.moderatorOnly || isModerator);

    return (
        <nav className={styles.sectionsSwitcher}>
            {visibleItems.map((item) => (
                <NavLink key={item.id} to={item.path} end={item.id === 'queue'} className={({isActive}) => (isActive ? styles.tabActive : styles.tab)}>{item.title}</NavLink>
            ))}
            <LogoutButton />
        </nav>
    )
}