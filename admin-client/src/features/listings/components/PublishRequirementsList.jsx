import styles from './PublishRequirementsList.module.css';

export default function PublishRequirementsList({ requirements }) {
    if (!requirements || requirements.length === 0) return null;

    return (
        <div className={styles.requirementsContainer}>
            <p className={styles.title}>Нельзя опубликовать, не хватает:</p>
            <ul className={styles.requirementsList}>
                {requirements.map((req) => <li key={req}>{req}</li>)}
            </ul>
        </div>
    );
}