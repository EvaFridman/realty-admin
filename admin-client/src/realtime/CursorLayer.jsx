import { useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import styles from './CursorLayer.module.css';

function stringToColor(str) {
    if (!str) return '#000';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
}

export default function CursorLayer() {
    const { socket, isConnected } = useSocket();
    const [cursors, setCursors] = useState({}); 

    useEffect(() => {
        if (!isConnected || !socket) return;

        const onMoved = (data) => {
            setCursors((prev) => ({ 
                ...prev, 
                [data.userId]: { ...data, at: Date.now() } 
            }));
        };

        socket.on("cursor:moved", onMoved);

        const timer = setInterval(() => {
            setCursors((prev) =>
                Object.fromEntries(
                    Object.entries(prev).filter(([, c]) => Date.now() - c.at < 5000)
                )
            );
        }, 2000);

        return () => { 
            socket.off("cursor:moved", onMoved); 
            clearInterval(timer); 
        };
    }, [socket, isConnected]);

    return (
        <div className={styles.cursorLayerContainer}>
            {Object.values(cursors).map((cursor) => {
                const userColor = stringToColor(String(cursor.userId));
                return (
                    <div 
                        key={cursor.userId} 
                        className={styles.cursor}
                        style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%`, '--user-color': userColor}}
                    >
                        <span className={styles.cursorLabel} style={{ backgroundColor: userColor }}>{cursor.email}</span>
                    </div>
                );
            })}
        </div>
    );
}