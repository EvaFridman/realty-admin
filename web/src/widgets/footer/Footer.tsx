import { Suspense } from "react";

import styles from "./Footer.module.css";

import { SectionSwitcher } from "../index";
import { ThemeSwitcher } from "@/features/theme/ThemeSwitcher";

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.content}`}>
                <div className={styles.mainInfo}>
                    <h2>Витрина</h2>
                    <p>Объявления о продаже и аренде жилья</p>
                </div>
                <Suspense fallback={null}>
                    <SectionSwitcher variant="header" />
                </Suspense>
                <ThemeSwitcher variant="footer" />
            </div>
        </footer>
    );
}