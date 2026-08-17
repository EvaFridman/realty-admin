import { useLocation, useNavigate } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle';
import ModeratorSelect from '../features/moderator/ModeratorSelect';

export default function SelectModeratorPage() {
    usePageTitle('Выбор модератора');

    const location = useLocation();
    const navigate = useNavigate();

    function handleSelect() {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
    }

    return (
        <div>
            <h1>Выберите модератора</h1>
            <ModeratorSelect onSelect={handleSelect} />
        </div>
    );
}