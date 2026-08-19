import styles from './LoginPage.module.css';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from "../api/auth/useAuth.js";
import { useState } from 'react';
import Loader from '../widgets/Loader.jsx';

const INITIAL_STATE = { email: '', password: '', error: null };

export default function LoginPage() {
    const { user, login, isBootstrapping } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState(INITIAL_STATE);

    const from = location.state?.from?.pathname ?? "/";

    if (isBootstrapping) return <Loader />;

    if (user) return <Navigate to={from} replace />

    const handleSubmit = async (e) => {
        e.preventDefault();
        setForm((prev) => ({ ...prev, error: null }));

        try {
            await login(form.email, form.password);
            navigate(from, { replace: true });
        } catch (error) {
            if (error.response) {
                setForm((prev) => ({ ...prev, error: "Неверная почта или пароль" }));
            } else {
                setForm((prev) => ({ ...prev, error: "Сервер недоступен" }));
            }
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value, error: null }));
    };


    return (
        <div className={styles.loginContainer}>
            <h2>Вход в систему</h2>
            <form className={styles.loginForm} noValidate onSubmit={handleSubmit}>
                <label htmlFor='email'>Электронная почта</label>
                <input type='email' id='email' required autoComplete='email' placeholder="email@example.com" value={form.email} onChange={handleChange}></input>
                <label htmlFor='password'>Пароль</label>
                <input type='password' id='password' required autoComplete='current-password' placeholder="Введите пароль" value={form.password} onChange={handleChange}></input>
                <button type='submit' className={styles.btn}>Войти</button>
            </form>
            {error && <p className={styles.errorMessage}>{form.error}</p>}
        </div>
    )
}