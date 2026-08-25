import styles from './PresenceBar.module.css';

export default function PresenceBar({ members }) {
    if (members.length === 0) return null;

    return (
        <div className={styles.bar}>
            {members.map((m) => (
                <span key={m.id} className={styles.badge}>{m.name}</span>
            ))}
        </div>
    );
}