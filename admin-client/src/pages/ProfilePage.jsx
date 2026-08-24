import styles from './Users.module.css'; 
import { useState } from 'react';
import { useAuth } from '../api/auth/useAuth.js';
import { useAlert } from '../components/common/AlertContext.jsx';
import { usersTransport } from '../api/UsersTransport.js';
import { api } from '../api/client.js';
import ImageUploader from '../components/upload/ImageUploader.jsx';
import { getUrl } from '../shared/utils/safeUrl';

export default function ProfilePage() {
    const { user, setUser, logout } = useAuth();
    const { showAlert } = useAlert();
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
    const [errors, setErrors] = useState({});
    const [isSending, setIsSending] = useState(false);
    const secureAvatarUrl = getUrl(user?.avatarUrl) || '/default-avatar.png';

    const handleInputChange = (e) => {
        setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({ ...prev, [e.target.name]: null }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setErrors({});

        try {
            await api.patch('/auth/password', passwordForm);
            showAlert('Пароль успешно изменён');
            setPasswordForm({ currentPassword: '', newPassword: '' });
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors({ currentPassword: 'Неверный текущий пароль' });
            } else {
                showAlert(err.response?.data?.error?.message || 'Не удалось изменить пароль');
            }
        } finally {
            setIsSending(false);
        }
    };

    const handleAvatarUploadDone = (result) => {
        const url = result?.data?.avatarUrl || result?.avatarUrl;
        if (url) {
            setUser(prev => {
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
                    <button type="button" onClick={logout} className={styles.logoutButton}>Выйти из панели</button>
                </div>

                <div className={styles.profileInfo}>
                    <h3>Профиль</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    
                    <form onSubmit={handlePasswordSubmit} className={styles.passwordForm} noValidate>
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
