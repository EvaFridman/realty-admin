import styles from './ViewingListItem.module.css';
import { viewingStatusLabels } from '../../constants/adminData';

export default function ViewingListItem({ viewing, onTransition }) {
    return (
        <div className={viewing._pending ? `${styles.viewingCard} ${styles.pending}` : styles.viewingCard}>
            <div className={styles.cardHeader}>
                <p className={styles.client}>{viewing.clientName ?? `Заявка №${viewing.id}`}</p>
                <span className={styles.status}>{viewingStatusLabels[viewing.status]}</span>
            </div>

            <p className={styles.listingLine}>{viewing.listing?.title}, {viewing.listing?.address}</p>

            {viewing.allowedTransitions && viewing.allowedTransitions.length > 0 ? (
                <div className={styles.viewingCardActions}>
                    {viewing.allowedTransitions.map((status) => (<button key={status} type="button" disabled={viewing._pending} onClick={() => onTransition(viewing.id, status)}>{viewingStatusLabels[status]}</button>))}
                </div>
            ) : (
                <p className={styles.finalNote}>Заявка закрыта, дальнейшие действия недоступны</p>
            )}
        </div>
    );
}