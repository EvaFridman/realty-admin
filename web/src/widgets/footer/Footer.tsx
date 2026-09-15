import styles from "./Footer.module.css";

import { SectionSwitcher } from "../index";
import { ThemeSwitcher } from "@/shared/ui";

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.content}`}>
                <div className={styles.mainInfo}>
                    <h2>Витрина</h2>
                    <p>Объявления о продаже и аренде жилья</p>
                </div>
                <SectionSwitcher variant="footer" />
                <ThemeSwitcher variant="footer" />
            </div>
        </footer>
    );
}