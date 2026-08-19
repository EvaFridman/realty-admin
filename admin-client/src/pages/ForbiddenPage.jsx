import { Link } from 'react-router';
import { useEffect } from 'react';
import { useTitle } from '../components/common/TitleContext';
import StatusMessage from '../components/common/StatusMessage';
import LogoutButton from "../widgets/LogoutButton"

export default function ForbiddenPage() {
    const { setTitle } = useTitle();
    useEffect(() => {
        setTitle('Доступ запрещен');
    }, [setTitle]);
    return (
        <div>
            <LogoutButton />
            <StatusMessage>Не хватает прав для доступа к странице.</StatusMessage>
            <Link to="/districts">назад</Link>
        </div>
    );
}