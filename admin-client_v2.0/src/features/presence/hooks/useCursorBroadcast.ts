import { useEffect } from 'react';

import { useSocket } from './useSocket';

export function useCursorBroadcast(room: string): void {
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!isConnected || !socket || !room) return;

        let lastTime = 0;

        const handleMouseMove = (event: MouseEvent): void => {
            const now = Date.now();
            if (now - lastTime < 50) return; 
            lastTime = now;

            socket.emit("cursor:move", {
                room,
                x: event.clientX / window.innerWidth,
                y: event.clientY / window.innerHeight,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => { window.removeEventListener('mousemove', handleMouseMove); };
    }, [socket, isConnected, room]);
}
