import styles from './RejectionForm.module.css';
import { useState } from 'react';

export default function RejectionForm({ onSubmit, onCancel }) {
    const [reason, setReason] = useState('');
    const canSubmit = reason.trim().length > 0;

    return (
        <div className={styles.rejectionForm}>
            <textarea placeholder="Причина отклонения" value={reason} onChange={(e) => setReason(e.target.value)} rows={3}/>
            <div className={styles.actions}>
                <button type="button" disabled={!canSubmit} onClick={() => onSubmit(reason)}>Отклонить</button>
                <button type="button" onClick={onCancel}>Отмена</button>
            </div>
        </div>
    );
}