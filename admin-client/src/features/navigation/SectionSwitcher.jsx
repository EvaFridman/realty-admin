import styles from './SectionSwitcher.module.css';
import { sections } from "../../constants/adminData.js";

export default function SectionSwitcher({activeSection, onSectionChange}) {
    return (
        <div className={styles.sectionsSwitcher}>
            {sections.map((section) => (
                <button key={section.id} type="button" className={section.id === activeSection ? styles.tabActive : styles.tab} onClick={() => onSectionChange(section.id)}>{section.title}</button>
            ))}
        </div>
    )
}