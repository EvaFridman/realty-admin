import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { FavoritesList } from "@/entities/favorites/FavoritesList";
import { getSession } from "@/features/session";

import styles from "./page.module.css";

type SearchParams = {
    tab?: string;
};

type Props = {
    searchParams: Promise<SearchParams>;
};

const TABS = [
    { id: "favorites", label: "Избранное" },
    { id: "viewings", label: "Мои заявки" },
    { id: "profile", label: "Профиль" },
] as const;

async function AccountContent({ searchParams }: Props) {
    const session = await getSession();

    if (!session) redirect("/login");

    const params = await searchParams;
    const activeTab = TABS.some((tab) => tab.id === params.tab) ? params.tab : "favorites";

    return (
        <section className={`container ${styles.page}`}>
            <h1>Кабинет</h1>

            <div className={styles.layout}>
                <nav className={styles.tabs} aria-label="Разделы кабинета">
                    {TABS.map((tab) => (
                        <Link
                            key={tab.id}
                            href={`/account?tab=${tab.id}`}
                            className={activeTab === tab.id ? styles.activeTab : styles.tab}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.content}>
                    {activeTab === "favorites" && (
                        <>
                            <h2>Избранное</h2>

                            <Suspense fallback={null}>
                                <FavoritesList />
                            </Suspense>
                        </>
                    )}

                    {activeTab === "viewings" && (
                        <div>
                            <h2>Мои заявки</h2>
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <div>
                            <h2>Профиль</h2>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function AccountPage(props: Props) {
    return (
        <Suspense fallback={null}>
            <AccountContent {...props} />
        </Suspense>
    );
}