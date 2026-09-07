import { useState, type ReactNode } from 'react';

import { AlertContext } from '@/shared/context';

import styles from './AlertProvider.module.css';

type Props = { children: ReactNode };

type AlertType = { id: number; message: string };

export function AlertProvider({ children }: Props): ReactNode {
    const [alerts, setAlerts] = useState<AlertType[]>([]);

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