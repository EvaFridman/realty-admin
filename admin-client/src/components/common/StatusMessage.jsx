import styles from './StatusMessage.module.css';

export default function StatusMessage({ children }) {
    return <div className={styles.statusMessage}>{children}</div>;
}