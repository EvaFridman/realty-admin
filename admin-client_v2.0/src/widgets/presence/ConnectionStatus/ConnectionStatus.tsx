import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { useSocket } from '@/app/presence/useSocket';

import styles from './ConnectionStatus.module.css';


const RESET_DELAY_MS = 3000;

export default function ConnectionStatus(): ReactNode {
    const { socket, isConnected } = useSocket();
    const [latency, setLatency] = useState<number | null>(null);
    const [isPinging, setIsPinging] = useState(false);
    const pingStartRef = useRef<number | null>(null);
    const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => { if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current) };
    }, []);

    const handlePing = useCallback((): void => {
        if (!socket || !isConnected || isPinging) return;

        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        setLatency(null);
        setIsPinging(true);
        pingStartRef.current = performance.now();

        const timeoutId = setTimeout(() => {
            socket.off('pong:check', onPong);
            setIsPinging(false);
        }, 5000);

        const onPong = (): void => {
            clearTimeout(timeoutId);
            const expired = Math.round(performance.now() - (pingStartRef.current ?? performance.now()));
            setLatency(expired);
            setIsPinging(false);

            resetTimeoutRef.current = setTimeout(() => {
                setLatency(null);
            }, RESET_DELAY_MS);
        };

        socket.once('pong:check', onPong);
        socket.emit('ping:check');
    }, [socket, isConnected, isPinging]);

    return (
        <div className={styles.wrapper}>
            <span
                className={String(styles.dot) + ' ' + String(isConnected ? styles.connected : styles.disconnected)}
                title={isConnected ? 'Соединено' : 'Нет соединения'}
            />
            <button type="button" className={styles.pingBtn} onClick={handlePing} disabled={!isConnected || isPinging}>
                {isPinging ? '…' : latency !== null ? String(latency) + ' мс' : 'Проверить связь'}
            </button>
        </div>
    );
}