import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getAccessToken } from '../api/tokenStore.js';

const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const instance = io(import.meta.env.VITE_API_BASE_URL, {
            auth: (cb) => cb({ token: getAccessToken() }),
        });

        socketRef.current = instance;

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        instance.on('connect', handleConnect);
        instance.on('disconnect', handleDisconnect);

        return () => {
            instance.off('connect', handleConnect);
            instance.off('disconnect', handleDisconnect);
            instance.disconnect();
            socketRef.current = null;
        };
    }, []);

    const value = { socket: socketRef.current, isConnected };

    return <SocketContext value={value}>{children}</SocketContext>;
}

export function useSocket() {
    const value = useContext(SocketContext);
    if (!value) throw new Error("useSocket must be used inside SocketProvider");
    return value;
}