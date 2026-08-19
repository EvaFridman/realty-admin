import styles from './Header.module.css';
import SectionSwitcher from "../features/navigation/SectionSwitcher.jsx";

export default function AdminLayout() {
    return (
        <header className={styles.header}>
            <h1>Админ-панель</h1>
            <SectionSwitcher  />
        </header>
    )
}