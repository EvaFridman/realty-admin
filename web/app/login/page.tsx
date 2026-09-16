import { LoginForm } from "@/features/auth/login/LoginForm";
import styles from "./page.module.css";

export default function LoginPage() {
    return (
        <section className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Вход</h1>
                <p className={styles.description}>Войдите, чтобы продолжить</p>
                <LoginForm />
            </div>
        </section>
    );
}