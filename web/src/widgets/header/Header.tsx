import { Suspense } from "react";
import Link from "next/link";

import styles from "./Header.module.css";
import { SectionSwitcher } from "@/features/navigation/SectionSwitcher";
import { Logo } from "@/shared/ui";
import { ThemeSwitcher } from "@/features/theme/ThemeSwitcher";
import { HeaderSearch } from "../../features/header-search/HeaderSearch";
import { RecentlyViewed } from "./RecentlyViewed";
import { getSession } from "@/features/session";
import { ProfileMenu } from "@/features/profile-menu/ProfileMenu";

export async function Header() {
    const session = await getSession();
    const user = session?.user ?? null;

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
                    {user ? (
                        <>
                            <ProfileMenu user={user} />
                            <Link href="/favorites" className={styles.favorite} aria-label="Избранное"> ♡ </Link>
                        </>
                    ) : (
                        <Link href="/login" className={styles.login}>Войти</Link>
                    )}
                    <ThemeSwitcher variant="header" />
                </div>
            </div>
        </header>
    );
}