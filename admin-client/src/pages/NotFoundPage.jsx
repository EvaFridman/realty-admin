import { Link } from 'react-router';
import StatusMessage from '../components/common/StatusMessage';

export default function NotFoundPage() {
    return (
        <div>
            <StatusMessage>Такой страницы не существует.</StatusMessage>
            <Link to="/">к очереди</Link>
        </div>
    );
}