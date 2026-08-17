import styles from './AdminLayout.module.css';
import { useState } from 'react';
import SectionSwitcher from "../features/navigation/SectionSwitcher.jsx";
import ModeratorSelect from "../features/moderator/ModeratorSelect.jsx";

export default function AdminLayout() {
    const [activeSection, setActiveSection] = useState('queue');

    return (
        <>
            <header className={styles.header}>
                <h1>Админ-панель</h1>
                <SectionSwitcher activeSection={activeSection} onSectionChange={setActiveSection} />
                <ModeratorSelect />
            </header>
        </>
    )
}