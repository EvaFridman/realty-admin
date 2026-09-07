import { useEffect, useState, type ReactElement, type CSSProperties } from 'react';

import { useSocket } from '@/shared/hooks/useSocket';

import styles from './CursorLayer.module.css';


type CursorDataType = {
    userId: number;
    x: number;
    y: number;
    email: string;
};

type CursorType = CursorDataType & { at: number };

type CursorStyleType = CSSProperties & { '--user-color': string };

function stringToColor(str: string): string {
    if (!str) return '#000';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
}

export default function CursorLayer(): ReactElement {
    const { socket, isConnected } = useSocket();
    const [cursors, setCursors] = useState<Record<number, CursorType>>({}); 

    useEffect(() => {
        if (!isConnected || !socket) return;

        const onMoved = (data: CursorDataType): void => {
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
                        style={{ left: String(cursor.x * 100) + '%', top: String(cursor.y * 100) + '%', '--user-color': userColor} as CursorStyleType}
                    >
                        <span className={styles.cursorLabel} style={{ backgroundColor: userColor }}>{cursor.email}</span>
                    </div>
                );
            })}
        </div>
    );
}