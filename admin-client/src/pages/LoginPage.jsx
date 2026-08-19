import styles from './LoginPage.module.css';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from "../api/auth/useAuth.js";
import { useState } from 'react';

export default function LoginPage() {
    const { user, login, isBootstrapping } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const from = location.state?.from?.pathname ?? "/";

    if (isBootstrapping) return null;

    if (user) return <Navigate to={from} replace />

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (error) {
            if (error.response) {
                setError("Неверная почта или пароль");
            } else {
                setError("Сервер недоступен");
            }
        }
    }

    return (
        <div className={styles.loginContainer}>
            <h2>Вход в систему</h2>
            <form className={styles.loginForm} noValidate onSubmit={handleSubmit}>
                <label htmlFor='email'>Электронная почта</label>
                <input type='email' id='email' required autoComplete='email' placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <label htmlFor='password'>Пароль</label>
                <input type='password' id='password' required autoComplete='current-password' placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type='submit' className={styles.btn}>Войти</button>
            </form>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    )
}