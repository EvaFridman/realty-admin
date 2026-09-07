import { useState, type ChangeEvent, type ReactNode } from 'react';

import styles from './RejectionForm.module.css';

type Props = {
    onSubmit: (reason: string) => void;
    onCancel: () => void;
};

export default function RejectionForm({ onSubmit, onCancel }: Props): ReactNode {
    const [reason, setReason] = useState('');
    const canSubmit = reason.trim().length > 0;

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void { setReason(e.target.value) }
    function handleSubmit(): void { onSubmit(reason)}

    return (
        <div className={styles.rejectionForm}>
            <textarea placeholder="Причина отклонения" value={reason} onChange={handleChange} rows={3}/>
            <div className={styles.actions}>
                <button type="button" disabled={!canSubmit} onClick={handleSubmit}>Отклонить</button>
                <button type="button" onClick={onCancel}>Отмена</button>
            </div>
        </div>
    );
}