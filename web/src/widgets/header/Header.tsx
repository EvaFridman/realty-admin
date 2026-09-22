import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";

import styles from "./Header.module.css";
import { SectionSwitcher } from "@/features/navigation/SectionSwitcher";
import { Logo, Loader } from "@/shared/ui";
import { ThemeSwitcher } from "@/features/theme/ThemeSwitcher";
import { HeaderSearch } from "../../features/header-search/HeaderSearch";
import { RecentlyViewed } from "./RecentlyViewed";
import { HeaderActions } from "./HeaderActions";

export async function Header() {
    const cookieStore = await cookies();
    const value = cookieStore.get("recentlyViewed")?.value;
    const serverIds = value ? decodeURIComponent(value).split(",").filter(Boolean) : [];

    return (
        <header className={styles.header}>
            <div className={`container ${styles.content}`}>
                <Logo />
                <Link href="/" className={styles.headerTitle}>Витрина</Link>
                <Suspense fallback={<Loader />}>
                    <SectionSwitcher variant="header" />
                </Suspense>
                <Suspense fallback={<Loader />}>
                    <HeaderSearch />
                </Suspense>
                <Suspense fallback={<Loader />}>
                    <RecentlyViewed serverIds={serverIds} />
                </Suspense>
                <HeaderActions />
                <ThemeSwitcher variant="header" />
            </div>
        </header>
    );
}