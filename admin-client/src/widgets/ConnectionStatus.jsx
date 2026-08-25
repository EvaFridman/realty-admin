import { useState, useRef, useCallback, useEffect } from 'react';
import { useSocket } from '../realtime/SocketProvider.jsx';
import styles from './ConnectionStatus.module.css';

const RESET_DELAY_MS = 3000;

export default function ConnectionStatus() {
    const { socket, isConnected } = useSocket();
    const [latency, setLatency] = useState(null);
    const [isPinging, setIsPinging] = useState(false);
    const pingStartRef = useRef(null);
    const resetTimeoutRef = useRef(null);

    useEffect(() => {
        return () => clearTimeout(resetTimeoutRef.current);
    }, []);

    const handlePing = useCallback(() => {
        if (!socket || !isConnected || isPinging) return;

        clearTimeout(resetTimeoutRef.current);
        setLatency(null);
        setIsPinging(true);
        pingStartRef.current = performance.now();

        const timeoutId = setTimeout(() => {
            socket.off('pong:check', onPong);
            setIsPinging(false);
        }, 5000);

        const onPong = () => {
            clearTimeout(timeoutId);
            const expired = Math.round(performance.now() - pingStartRef.current);
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
                className={`${styles.dot} ${isConnected ? styles.connected : styles.disconnected}`}
                title={isConnected ? 'Соединено' : 'Нет соединения'}
            />
            <button type="button" className={styles.pingBtn} onClick={handlePing} disabled={!isConnected || isPinging}>
                {isPinging ? '…' : latency !== null ? `${latency} мс` : 'Проверить связь'}
            </button>
        </div>
    );
}