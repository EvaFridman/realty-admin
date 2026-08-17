import { Link } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle';
import StatusMessage from '../components/common/StatusMessage';

export default function NotFoundPage() {
    usePageTitle('Страница не найдена');
    return (
        <div>
            <StatusMessage>Такой страницы не существует.</StatusMessage>
            <Link to="/">к очереди</Link>
        </div>
    );
}