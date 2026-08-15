import styles from './App.module.css';
import { useState } from 'react';
import SectionSwitcher from "./features/navigation/SectionSwitcher.jsx";
import ModeratorSelect from "./features/moderator/ModeratorSelect.jsx";
import ListingsSection from "./features/listings/queue/ListingsSection.jsx";
import DistrictsSection from "./features/districts/DistrictsSection.jsx";
import ViewingsSection from "./features/viewings/ViewingsSection.jsx";

function App() {
    const [activeSection, setActiveSection] = useState('queue');

    return (
        <>
            <header className={styles.header}>
                <h1>Админ-панель</h1>
                <SectionSwitcher activeSection={activeSection} onSectionChange={setActiveSection} />
                <ModeratorSelect />
            </header>

            <main>
                {activeSection === 'queue' && <ListingsSection statusFilter="moderation" />}
                {activeSection === 'listings' && <ListingsSection statusFilter={null} />}
                {activeSection === 'viewings' && <ViewingsSection />}
                {activeSection === 'districts' && <DistrictsSection />}
            </main>
        </>
    );
}

export default App;