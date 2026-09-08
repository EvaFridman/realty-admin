import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';

import { useTitle } from '@/shared/context';
import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';

export default function NotFoundPage(): ReactNode {
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle('Страница не найдена');
    }, [setTitle]);

    return (
        <div>
            <StatusMessage>Такой страницы не существует.</StatusMessage>
            <Link to="/">к очереди</Link>
        </div>
    );
}