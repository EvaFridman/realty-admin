import { Suspense } from "react";
import Link from "next/link";

import styles from "./Header.module.css";
import { SectionSwitcher } from "../index";
import { ThemeSwitcher, Logo } from "@/shared/ui";
import { HeaderSearch } from "../../features/header-search/HeaderSearch";
import { RecentlyViewed } from "./RecentlyViewed";

export function Header() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.content}`}>
                <Logo />
                <Link href="/" className={styles.headerTitle}>Витрина</Link>
                <Suspense fallback={null}>
                    <SectionSwitcher variant="header" />
                </Suspense>
                <Suspense fallback={null}>
                    <HeaderSearch />
                </Suspense>
                <Suspense fallback={null}>
                    <RecentlyViewed />
                </Suspense>
                <div className={styles.actions}>
                    {/* TODO: поменять, когда появится функционал по подтягиванию пользователя из БД */}
                    <Link href="/login" className={styles.login}>Войти</Link>
                    <ThemeSwitcher variant="header" />
                </div>
            </div>
        </header>
    );
}