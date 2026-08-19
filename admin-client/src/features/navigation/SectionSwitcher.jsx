import styles from './SectionSwitcher.module.css';
import { NavLink } from 'react-router';
import { navItems } from "../../constants/adminData.js";
import LogoutButton from "../../widgets/LogoutButton"

export default function SectionSwitcher() {
    return (
        <nav className={styles.sectionsSwitcher}>
            {navItems.map((item) => (
                <NavLink key={item.id} to={item.path} end={item.id === 'queue'} className={({isActive}) => (isActive ? styles.tabActive : styles.tab)}>{item.title}</NavLink>
            ))}
            <LogoutButton />
        </nav>
    )
}