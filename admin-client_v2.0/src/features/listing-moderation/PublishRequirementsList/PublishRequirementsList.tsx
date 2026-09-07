import type { ReactNode } from 'react';

import styles from './PublishRequirementsList.module.css';

type Props = { requirements: string[] };

export default function PublishRequirementsList({ requirements }: Props): ReactNode {
    if (requirements.length === 0) return null;

    return (
        <div className={styles.requirementsContainer}>
            <p className={styles.title}>Нельзя опубликовать, не хватает:</p>
            <ul className={styles.requirementsList}>
                {requirements.map((requirement, index) => <li key={index}>{requirement}</li>)}
            </ul>
        </div>
    );
}