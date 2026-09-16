import Link from "next/link";
import type { AuthUser } from "@/entities/user/types";
import { logout } from "@/features/auth/actions";
import styles from "./ProfileMenu.module.css";

type ProfileMenuProps = {
    user: AuthUser;
};

export function ProfileMenu({ user }: ProfileMenuProps) {
    return (
        <details className={styles.menu}>
            <summary className={styles.trigger}>
                <span>{user.name}</span>
                <span className={styles.arrow}>⌄</span>
            </summary>

            <div className={styles.dropdown}>
                <Link href="/profile" className={styles.item}>Профиль</Link>
                <form action={logout}>
                    <button type="submit" className={styles.item}>Выйти</button>
                </form>
            </div>
        </details>
    );
}