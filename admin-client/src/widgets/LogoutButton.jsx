import { useAuth } from '../api/auth/useAuth';
import { useNavigate } from 'react-router';

export default function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return <button onClick={handleLogout}>Выйти</button>;
}