import axios from 'axios';
import { useState, type ChangeEvent, type ReactNode, type SyntheticEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { useAuth } from '@/features/auth';

import PageLoader from '@/shared/ui/PageLoader/PageLoader';

import styles from './LoginPage.module.css';

type LoginFormType = {
    email: string;
    password: string;
    error: string | null;
};

type LocationStateType = {
    from?: {
        pathname?: string;
    };
};

const INITIAL_STATE: LoginFormType = { email: '', password: '', error: null };

export default function LoginPage(): ReactNode {
    const { user, login, isBootstrapping } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as LocationStateType | null;
    const [form, setForm] = useState<LoginFormType>(INITIAL_STATE);

    const from = locationState?.from?.pathname ?? "/";

    if (isBootstrapping) return <PageLoader />;

    if (user) return <Navigate to={from} replace />

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setForm((prev) => ({ ...prev, error: null }));

        try {
            await login(form.email, form.password);
            void navigate(from, { replace: true });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                setForm((prev) => ({ ...prev, error: "Неверная почта или пароль" }));
            } else {
                setForm((prev) => ({ ...prev, error: "Сервер недоступен" }));
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value, error: null }));
    };


    return (
        <div className={styles.loginContainer}>
            <h2>Вход в систему</h2>
            <form className={styles.loginForm} noValidate onSubmit={(e) => { void handleSubmit(e); }}>
                <label htmlFor='email'>Электронная почта</label>
                <input type='email' id='email' required autoComplete='email' placeholder="email@example.com" value={form.email} onChange={handleChange}></input>
                <label htmlFor='password'>Пароль</label>
                <input type='password' id='password' required autoComplete='current-password' placeholder="Введите пароль" value={form.password} onChange={handleChange}></input>
                <button type='submit' className={styles.btn}>Войти</button>
            </form>
            {form.error && <p className={styles.errorMessage}>{form.error}</p>}
        </div>
    )
}