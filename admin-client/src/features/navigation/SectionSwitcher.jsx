import styles from './SectionSwitcher.module.css';
import { NavLink } from 'react-router';
import { sections } from "../../constants/adminData.js";

export default function SectionSwitcher() {
    return (
        <nav className={styles.sectionsSwitcher}>
            {sections.map((section) => (
                <NavLink key={section.id} to={section.path} end={section.id === 'queue'} className={({isActive}) => (isActive ? styles.tabActive : styles.tab)}>{section.title}</NavLink>
            ))}
        </nav>
    )
}