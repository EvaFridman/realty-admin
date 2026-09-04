import { useAuth } from './useAuth';
import { useNavigate } from 'react-router';

export function useLogout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return async function logoutUser() {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };
}