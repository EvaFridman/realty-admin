import { useState, type ReactNode } from 'react';
import { useParams } from 'react-router';

import { useAuth } from '@/features/auth';

import type { ListingType } from '@/entities/listing';
import { ListingsTransport } from '@/entities/listing';
import type { UserType } from '@/entities/user';
import { usersTransport } from '@/entities/user';

import type { PaginationMetaType } from '@/shared/api/types';
import { useAlert } from '@/shared/context/AlertContext';
import useFetch from '@/shared/hooks/useFetch';
import ImageUploader from '@/shared/ui/ImageUploader/ImageUploader';
import PageLoader from '@/shared/ui/PageLoader/PageLoader';
import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';

import styles from '../users/Users.module.css';

const listingsTransport = new ListingsTransport();

export default function UserDetailPage(): ReactNode {
    const { id } = useParams();
    const { user: currentUser, setUser } = useAuth();
    const { showAlert } = useAlert();
    const [refreshKey, setRefreshKey] = useState(0);
    const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(null);

    const userId = Number(id);

    const { data: profile, isLoading: isUserLoading, error: userError } = useFetch<UserType>(
        (signal) => usersTransport.getById<UserType>(userId, '', { signal }),
        [id, refreshKey]
    );

    const { data: listings, isLoading: isListingsLoading } = useFetch<ListingType[], PaginationMetaType>(
        (signal) => listingsTransport.list<ListingType[], PaginationMetaType>(
            { agentId: userId },
            { signal }
        ),
        [id, refreshKey]
    );

    const handleAvatarUploadDone = (result: UserType): void => {
        if (result.avatarUrl) {
            setUploadedAvatarUrl(`${result.avatarUrl}?cb=${String(Date.now())}`);
        }
        
        setRefreshKey((prev) => prev + 1);
        showAlert('Фотография профиля успешно обновлена');

        if (currentUser && currentUser.id === userId && result.avatarUrl) {
            setUser({ ...currentUser, avatarUrl: result.avatarUrl });
        }
    };


    if (isUserLoading || isListingsLoading) return <StatusMessage><PageLoader /></StatusMessage>;
    if (userError || !profile) return <StatusMessage>{userError || 'Пользователь не найден'}</StatusMessage>;

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.avatarBlock}>
                    <img 
                        src={uploadedAvatarUrl || (profile.avatarUrl ? `${profile.avatarUrl}?t=${String(refreshKey)}` : '/static/default-avatar.webp')} 
                        alt="Аватар пользователя" 
                        className={styles.profileAvatar} 
                    />
                    <ImageUploader 
                        upload={(files, options) => usersTransport.uploadAvatar(userId, files, options)} 
                        onDone={handleAvatarUploadDone}
                        maxSize={2}
                        maxFiles={1}
                    />
                </div>

                <div className={styles.profileInfo}>
                    <h3>{profile.name}</h3>
                    <p><strong>Электронная почта:</strong> {profile.email}</p>
                    <p><strong>Телефон:</strong> {profile.phone || '—'}</p>
                    <p><strong>Роль:</strong> <span className={[styles.badge, styles[profile.role]].filter(Boolean).join(' ')}>{profile.role}</span></p>
                </div>
            </div>

            <div className={styles.listingsBlock}>
                <h3>Объявления пользователя ({listings?.length ?? 0})</h3>
                
                {!listings || listings.length === 0 ? (
                    <StatusMessage>У данного пользователя пока нет объявлений</StatusMessage>
                ) : (
                    <div className={styles.listingsGrid}>
                        {listings.map((listing) => (
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