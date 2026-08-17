import styles from './ListingErrorView.module.css';
import { Link } from 'react-router';
import StatusMessage from '../../components/common/StatusMessage';
import { ApiError } from '../../api/ApiError.js';

export default function ListingErrorView({ error, backLink }) {
    if (!error) return null;

    const is404 = error instanceof ApiError ? error.status === 404 : String(error).toLowerCase().includes('not found') || String(error).includes('404');

    if (is404) {
        return (
            <div className={styles.errorPage}>
                <StatusMessage>Объявления с таким ID не существует.</StatusMessage>
                <Link to={backLink} className={styles.backBtn}>к списку объявлений</Link>
            </div>
        );
    }

    const errorMessage = error instanceof ApiError ? error.message : String(error);
    return (
        <div className={styles.errorPage}>
            <StatusMessage>Ошибка: {errorMessage}</StatusMessage>
            <Link to={backLink} className={styles.backBtn}>к списку объявлений</Link>
        </div>
    );
}
