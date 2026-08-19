import styles from './ErrorView.module.css';
import StatusMessage from '../../components/common/StatusMessage.jsx';

export default function ErrorView({ error, children, onRetry }) {
    if (!error) return null;

    const status = error.response?.status;
    const message = error.response?.data?.error?.message ?? error.message;

    return (
        <div className={styles.errorPage}>
            <StatusMessage>{status === 404 ? 'Ресурс не найден.' : `Ошибка: ${message}`}</StatusMessage>
            {children}
            {onRetry && <button className={styles.btn} onClick={onRetry}>Повторить</button>}
        </div>
    );
}