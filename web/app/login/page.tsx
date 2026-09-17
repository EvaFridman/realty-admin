import { Suspense } from "react";

import { LoginForm } from "@/features/auth/login/LoginForm";

import styles from "./page.module.css";

type Props = {
    searchParams: Promise<{ returnUrl?: string }>;
};

async function LoginPageContent({ searchParams }: Props) {
    const params = await searchParams;

    return (
        <section className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Вход</h1>
                <p className={styles.description}>Войдите, чтобы продолжить</p>
                <LoginForm returnUrl={params.returnUrl}/>
            </div>
        </section>
    );
}

export default function LoginPage(props: Props) {
    return (
        <Suspense fallback={null}>
            <LoginPageContent {...props}/>
        </Suspense>
    );
}