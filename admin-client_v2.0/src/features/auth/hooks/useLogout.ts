import { useNavigate } from 'react-router';

import { handleLogout } from '../tools/handle-logout';

export function useLogout(setUser: (user: unknown) => void): () => Promise<void> {
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