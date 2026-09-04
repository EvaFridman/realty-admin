import { useState, type ReactNode } from 'react';

import styles from './AlertProvider.module.css';
import { AlertContext } from '@/shared/context/AlertContext';

type AlertProviderProps = { children: ReactNode };

type Alert = { id: number; message: string };

export function AlertProvider({ children }: AlertProviderProps) {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    function showAlert(message: string): void {
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