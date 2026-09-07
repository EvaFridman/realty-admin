import { useNavigate } from 'react-router';

import { handleLogout } from '../tools/handle-logout';

import { useAuth } from './useAuth';

export function useLogout(): () => Promise<void> {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    return async function logoutUser(): Promise<void> {
        try {
            await handleLogout();
            setUser(null);
            void navigate('/login', { replace: true });
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };
}