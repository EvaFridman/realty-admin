"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import styles from "./ThemeSwitcher.module.css";

type Theme = "light" | "dark" | "system";

type Props = {
    variant: "header" | "footer";
};

const themes: { id: Theme; title: string }[] = [
    { id: "light", title: "Светлая" },
    { id: "dark", title: "Тёмная" },
    { id: "system", title: "Системная" },
];

function getSystemTheme(): "light" | "dark" {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
    const actualTheme = theme === "system" ? getSystemTheme() : theme;
    document.documentElement.setAttribute("data-theme", actualTheme);
}

export function ThemeSwitcher({ variant }: Props): ReactNode {
    const [theme, setTheme] = useState<Theme>("system");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
            applyTheme(savedTheme);
            return;
        }
        applyTheme("system");
    }, []);

    useEffect(() => {
        if (theme !== "system") {
            applyTheme(theme);
            return;
        }
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        applyTheme("system");
        function handleChange() { applyTheme("system") }
        mediaQuery.addEventListener("change", handleChange);
        return () => { mediaQuery.removeEventListener("change", handleChange) };
    }, [theme]);

    function handleThemeChange(nextTheme: Theme) {
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
    }

    return (
        <div className={styles[variant]}>
            {variant === "footer" && (<span className={styles.label}>Тема</span>)}

            <div className={styles.buttons}>
                {themes.map((item) => (
                    <button key={item.id} type="button"
                        className={theme === item.id ? styles.active : styles.button}
                        onClick={() => handleThemeChange(item.id)}
                    >
                        {item.title}
                    </button>
                ))}
            </div>
        </div>
    );
}