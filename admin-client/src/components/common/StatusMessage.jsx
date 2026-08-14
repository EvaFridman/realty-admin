import styles from './StatusMessage.module.css';

export default function StatusMessage({ children }) {
    return <p className={styles.statusMessage}>{children}</p>;
}