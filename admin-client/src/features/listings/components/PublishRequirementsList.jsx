import styles from './PublishRequirementsList.module.css';

export default function PublishRequirementsList({ requirements }) {
    if (!Array.isArray(requirements) || requirements.length === 0) return null;

    return (
        <div className={styles.requirementsContainer}>
            <p className={styles.title}>Нельзя опубликовать, не хватает:</p>
            <ul className={styles.requirementsList}>
                {requirements.map((req, index) => <li key={index}>{req}</li>)}
            </ul>
        </div>
    );
}