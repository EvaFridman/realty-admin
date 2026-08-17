import styles from './ErrorView.module.css';
import StatusMessage from '../../components/common/StatusMessage.jsx';
import { ApiError } from '../../api/ApiError.js';

export default function ErrorView({ error, children }) {
    if (!error) return null;

    const is404 = error instanceof ApiError ? error.status === 404 : String(error).toLowerCase().includes('not found') || String(error).includes('404');
    const message = is404 ? 'Ресурс не найден.' : `Ошибка: ${error instanceof ApiError ? error.message : String(error)}`;

    return (
        <div className={styles.errorPage}>
            <StatusMessage>{message}</StatusMessage>
            {children}
        </div>
    );
}
