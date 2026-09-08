import axios from 'axios';
import { useState, type ChangeEvent, type ReactNode, type SyntheticEvent } from 'react';

import { useAuth } from '@/features/auth';

import type { UserType } from '@/entities/user';
import { usersTransport } from '@/entities/user';

import { api } from '@/shared/api';
import { useAlert } from '@/shared/context/AlertContext';
import ImageUploader from '@/shared/ui/ImageUploader/ImageUploader';
import { getUrl } from '@/shared/utils/safeUrl';


import styles from '../users/Users.module.css';

type PasswordFormType = {
    currentPassword: string;
    newPassword: string;
};

type PasswordErrorsType = Partial<Record<keyof PasswordFormType, string | null>>;

type ErrorResponseDataType = {
    error?: {
        message?: string;
    };
};

export default function ProfilePage(): ReactNode {
    const { user, setUser, logout } = useAuth();
    const { showAlert } = useAlert();
    const [passwordForm, setPasswordForm] = useState<PasswordFormType>({ currentPassword: '', newPassword: '' });
    const [errors, setErrors] = useState<PasswordErrorsType>({});
    const [isSending, setIsSending] = useState(false);
    const secureAvatarUrl = getUrl(user?.avatarUrl ?? null) || '/default-avatar.png';
    if (!user) return null;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    };

    const handlePasswordSubmit = async (e: SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsSending(true);
        setErrors({});

        try {
            await api({
                url: '/auth/password',
                method: 'PATCH',
                data: passwordForm,
            });
            showAlert('Пароль успешно изменён');
            setPasswordForm({ currentPassword: '', newPassword: '' });
        } catch (err: unknown) {
            if (axios.isAxiosError<ErrorResponseDataType>(err) && err.response?.status === 422) {
                setErrors({ currentPassword: 'Неверный текущий пароль' });
            } else if (axios.isAxiosError<ErrorResponseDataType>(err)) {
                const message = err.response?.data.error?.message;

                showAlert(message ?? 'Не удалось изменить пароль');
            } else {
                showAlert('Не удалось изменить пароль');
            }
        } finally {
            setIsSending(false);
        }
    };

    const handleAvatarUploadDone = (result: UserType): void => {
        const url = result.avatarUrl;

        if (url) {
            setUser((prev) => {
                if (!prev) return prev;
                return { ...prev, avatarUrl: url };
            });
            showAlert('Фотография профиля успешно обновлена');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>

                <div className={styles.avatarBlock}>
                    <img src={secureAvatarUrl} alt="Аватар" className={styles.roundAvatar} />
                    <ImageUploader 
                        upload={(files, options) => usersTransport.uploadAvatar(user.id, files, options)} 
                        onDone={handleAvatarUploadDone}
                        maxSize={2}
                        maxFiles={1}
                    />
                    <button type="button" onClick={() => { void logout(); }} className={styles.logoutButton}>Выйти из панели</button>
                </div>

                <div className={styles.profileInfo}>
                    <h3>Профиль</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    
                    <form onSubmit={(e) => { void handlePasswordSubmit(e); }} className={styles.passwordForm} noValidate>
                        <div className={styles.fieldGroup}>
                            <label>Текущий пароль</label>
                            <input type="password" name="currentPassword" autoComplete="current-password" value={passwordForm.currentPassword} onChange={handleInputChange} disabled={isSending} required />
                            {errors.currentPassword && <span className={styles.errorMessage}>{errors.currentPassword}</span>}
                        </div>

                        <div className={styles.fieldGroup}>
                            <label>Новый пароль</label>
                            <input type="password" name="newPassword" autoComplete="new-password" value={passwordForm.newPassword} onChange={handleInputChange} disabled={isSending} required />
                            {errors.newPassword && <span className={styles.errorMessage}>{errors.newPassword}</span>}
                        </div>

                        <button type="submit" disabled={isSending} className={styles.submitButton}>{isSending ? 'Сохранение...' : 'Изменить пароль'}</button>
                    </form>
                </div>

            </div>
        </div>
    );
}