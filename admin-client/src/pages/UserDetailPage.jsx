import styles from './Users.module.css';
import { useState } from 'react';
import { useParams } from 'react-router';
import { usersTransport } from '../api/UsersTransport.js';
import { api } from '../api/client.js';
import ImageUploader from '../components/upload/ImageUploader.jsx';
import { useAuth } from '../api/auth/useAuth.js';
import { useAlert } from '../components/common/AlertContext.jsx';
import StatusMessage from '../components/common/StatusMessage.jsx';
import useFetch from '../hooks/useFetch.js';
import PageLoader from '../widgets/PageLoader.jsx';

export default function UserDetailPage() {
    const { id } = useParams();
    const { user: currentUser, setUser } = useAuth();
    const { showAlert } = useAlert();
    const [refreshKey, setRefreshKey] = useState(0);

    const { data: userData, isLoading: isUserLoading, error: userError } = useFetch(
        (signal) => usersTransport.getById(id, '', { signal }),
        [id, refreshKey]
    );

    const { data: listingsData, isLoading: isListingsLoading } = useFetch(
        (signal) => api.get('/listings', { params: { agentId: id }, signal }),
        [id, refreshKey]
    );

    const profile = userData?.data;
    const listings = listingsData?.data || [];

    const handleAvatarUploadDone = (result) => {
        setRefreshKey(prev => prev + 1);
        showAlert('Фотография профиля успешно обновлена');
        if (currentUser && currentUser.id === Number(id)) setUser(prev => ({ ...prev, avatarUrl: result?.data?.avatarUrl }));
    };

    if (isUserLoading || isListingsLoading) return <StatusMessage><PageLoader /></StatusMessage>;
    if (userError || !profile) return <StatusMessage>{userError || 'Пользователь не найден'}</StatusMessage>;

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.avatarBlock}>
                    <img 
                        src={profile.avatarUrl ? `${import.meta.env.VITE_API_BASE_URL}${profile.avatarUrl}` : '/default-avatar.png'} 
                        alt="Аватар пользователя" 
                        className={styles.profileAvatar} 
                    />
                    <ImageUploader 
                        upload={(files, options) => usersTransport.uploadAvatar(id, files, options)} 
                        onDone={handleAvatarUploadDone}
                        maxSize={2}
                        maxFiles={1}
                    />
                </div>

                <div className={styles.profileInfo}>
                    <h3>{profile.name}</h3>
                    <p><strong>Электронная почта:</strong> {profile.email}</p>
                    <p><strong>Телефон:</strong> {profile.phone || '—'}</p>
                    <p><strong>Роль:</strong> <span className={`${styles.badge} ${styles[profile.role]}`}>{profile.role}</span></p>
                </div>
            </div>

            <div className={styles.listingsBlock}>
                <h3>Объявления пользователя ({listings.length})</h3>
                
                {listings.length === 0 ? (
                    <StatusMessage>У данного пользователя пока нет объявлений</StatusMessage>
                ) : (
                    <div className={styles.listingsGrid}>
                        {listings.map(listing => (
                            <div key={listing.id} className={styles.listingCard}>
                                <h4>{listing.title}</h4>
                                <p>Цена: {listing.price} ₽</p>
                                <p>Статус: {listing.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}