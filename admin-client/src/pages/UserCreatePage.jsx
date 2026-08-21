import styles from './Users.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usersTransport } from '../api/UsersTransport.js';
import { useAlert } from '../components/common/AlertContext.jsx';

export default function UserCreatePage() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [form, setForm] = useState({ email: '', password: '', name: '', phone: '', role: 'agent' });
    const [errors, setErrors] = useState({});
    const [isSending, setIsSending] = useState(false);

    const handleInputChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({ ...prev, [e.target.name]: null }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setErrors({});

        try {
            const response = await usersTransport.create(form);
            showAlert('Учётная запись успешно создана!');
            navigate(`/users/${response?.data?.id}`);
        } catch (err) {
            if (err.response?.status === 422 && err.response.data?.error?.details) {
                const errorsMap = {};
                err.response.data.error.details.forEach(detail => { errorsMap[detail.path] = detail.message });
                setErrors(errorsMap);
            } else if (err.response?.status === 409) {
                setErrors({ email: 'Эта электронная почта уже занята' });
            } else {
                showAlert(err.response?.data?.error?.message || 'Не удалось создать пользователя. Попробуйте позже.');
            }
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={styles.formCard}>
            <h2>Создание нового пользователя</h2>
            <form onSubmit={handleFormSubmit} className={styles.form} noValidate>
                
                <div className={styles.fieldGroup}>
                    <label>Имя</label>
                    <input type="text" name="name" value={form.name} onChange={handleInputChange} disabled={isSending} required />
                    {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                </div>

                <div className={styles.fieldGroup}>
                    <label>Электронная почта (Email)</label>
                    <input type="email" name="email" value={form.email} onChange={handleInputChange} disabled={isSending} required />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>

                <div className={styles.fieldGroup}>
                    <label>Пароль</label>
                    <input type="password" name="password" value={form.password} autoComplete="new-password" onChange={handleInputChange} disabled={isSending} required />
                    {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                </div>

                <div className={styles.fieldGroup}>
                    <label>Телефон</label>
                    <input type="text" name="phone" placeholder="+79991112233" value={form.phone} onChange={handleInputChange} disabled={isSending} />
                    {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                </div>

                <div className={styles.fieldGroup}>
                    <label>Роль</label>
                    <select name="role" value={form.role} onChange={handleInputChange} disabled={isSending}>
                        <option value="agent">Агент</option>
                        <option value="moderator">Модератор</option>
                    </select>
                    {errors.role && <span className={styles.errorMessage}>{errors.role}</span>}
                </div>

                <button type="submit" disabled={isSending} className={styles.submitButton}>{isSending ? 'Сохранение...' : 'Создать пользователя'}</button>
            </form>
        </div>
    );
}