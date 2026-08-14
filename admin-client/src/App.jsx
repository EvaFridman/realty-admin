import styles from './App.module.css';
import { useState } from 'react';
import SectionSwitcher from './components/layout/SectionSwitcher';
import ModeratorSelect from './components/layout/ModeratorSelect';
import ListingsSection from './components/queue/ListingsSection';
import DistrictsSection from './components/districts/DistrictsSection';
import StatusMessage from './components/common/StatusMessage';

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
                {activeSection === 'viewings' && <StatusMessage>Заявки</StatusMessage>}
                {activeSection === 'districts' && <DistrictsSection />}
            </main>
        </>
    );
}

export default App;