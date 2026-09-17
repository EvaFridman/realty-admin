"use client";

import Link from "next/link";

import type { AuthUser } from "@/shared/session/types";
import { logout } from "@/features/auth/actions";

import styles from "./ProfileMenu.module.css";

type Props = {
    user: AuthUser;
    onLogout: () => void;
};

export function ProfileMenu({ user, onLogout }: Props) {
    async function handleLogout() {
        await logout();
        onLogout();
    }

    return (
        <details className={styles.menu}>
            <summary className={styles.trigger}>
                <span>{user.name}</span>
                <span className={styles.arrow}>⌄</span>
            </summary>

            <div className={styles.dropdown}>
                <Link href="/account/profile" className={styles.item}>Профиль</Link>
                <form action={handleLogout}>
                    <button type="submit" className={styles.item}>Выйти</button>
                </form>
            </div>
        </details>
    );
}