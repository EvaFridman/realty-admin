import { Link } from 'react-router';
import { useEffect } from 'react';
import { useTitle } from '../components/common/TitleContext';
import StatusMessage from '../components/common/StatusMessage';

export default function NotFoundPage() {
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