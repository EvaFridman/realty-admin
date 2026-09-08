import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';

import { useAuth } from '@/features/auth';

import { useTitle } from '@/shared/context';
import Button from '@/shared/ui/Button/Button';
import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';

export default function ForbiddenPage(): ReactNode {
    const { logout } = useAuth();
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle('Доступ запрещен');
    }, [setTitle]);

    return (
        <div>
            <Button type="button" onClick={() => { void logout(); }}>Выйти</Button>
            <StatusMessage>Не хватает прав для доступа к странице.</StatusMessage>
            <Link to="/districts">назад</Link>
        </div>
    );
}