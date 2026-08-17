import styles from './AlertProvider.module.css';
import { useState } from 'react';
import { AlertContext } from './AlertContext';

export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState([]);

    function showAlert(message) {
        const id = Date.now() + Math.random();
        setAlerts((prev) => [...prev, { id, message }]);
        setTimeout(() => { setAlerts((prev) => prev.filter((a) => a.id !== id))}, 4000);
    }

    return (
        <AlertContext value={{ showAlert }}>
            {children}
            <div className={styles.alerts}>
                {alerts.map((a) => (<div key={a.id} className={styles.alert}>{a.message}</div>))}
            </div>
        </AlertContext>
    );
}