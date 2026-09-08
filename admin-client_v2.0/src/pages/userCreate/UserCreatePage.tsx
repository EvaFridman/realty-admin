import axios from 'axios';
import { useState, type ChangeEvent, type ReactNode, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';

import type { UserRoleType, UserType } from '@/entities/user';
import { usersTransport } from '@/entities/user';

import { useAlert } from '@/shared/context/AlertContext';

import styles from '../users/Users.module.css';

type FormType = {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: UserRoleType;
};

type ErrorsType = Partial<Record<keyof FormType, string | null>>;

type ValidationDetailType = {
    path: keyof FormType;
    message: string;
};

type ErrorResponseDataType = {
    error?: {
        message?: string;
        details?: ValidationDetailType[];
    };
};

export default function UserCreatePage(): ReactNode {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [form, setForm] = useState<FormType>({ email: '', password: '', name: '', phone: '', role: 'agent' });
    const [errors, setErrors] = useState<ErrorsType>({});
    const [isSending, setIsSending] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    };

    const handleFormSubmit = async (e: SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsSending(true);
        setErrors({});

        try {
            const response = await usersTransport.create<UserType>(form);
            showAlert('Учётная запись успешно создана!');
            if (response.data) void navigate(`/users/${String(response.data.id)}`);
        } catch (err: unknown) {
            if (axios.isAxiosError<ErrorResponseDataType>(err) && err.response?.status === 422 && err.response.data.error?.details) {
                const errorsMap: ErrorsType = {};

                err.response.data.error.details.forEach((detail) => {
                    errorsMap[detail.path] = detail.message;
                });

                setErrors(errorsMap);
            } else if (axios.isAxiosError<ErrorResponseDataType>(err) && err.response?.status === 409) {
                setErrors({ email: 'Эта электронная почта уже занята' });
            } else if (axios.isAxiosError<ErrorResponseDataType>(err)) {
                showAlert(err.response?.data.error?.message ?? 'Не удалось создать пользователя. Попробуйте позже.');
            } else {
                showAlert('Не удалось создать пользователя. Попробуйте позже.');
            }
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={styles.formCard}>
            <h2>Создание нового пользователя</h2>
            <form onSubmit={(e) => { void handleFormSubmit(e); }} className={styles.form} noValidate>
                
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