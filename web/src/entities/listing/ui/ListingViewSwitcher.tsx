"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from "./ListingViewSwitcher.module.css";

type View = "grid" | "list";

type Props = {
    view: View;
};

export function ListingViewSwitcher({ view }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function changeView(nextView: View) {
        const params = new URLSearchParams(searchParams.toString());

        if (nextView === "grid") {
            params.delete("view");
        } else {
            params.set("view", nextView);
        }

        router.replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className={styles.switcher} aria-label="Вид объявлений">
            <button
                type="button"
                className={view === "grid" ? styles.active : styles.button}
                onClick={() => changeView("grid")}
                aria-label="Плитка"
                aria-pressed={view === "grid"}
            >
                ▦
            </button>

            <button
                type="button"
                className={view === "list" ? styles.active : styles.button}
                onClick={() => changeView("list")}
                aria-label="Список"
                aria-pressed={view === "list"}
            >
                ☰
            </button>
        </div>
    );
}