import { useEffect, useState, type ReactElement, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

import { useAuth, getAccessToken } from '@/features/auth';
import type { SocketContextValueType } from '@/features/presence';

import { SocketContext } from './SocketContext';

type Props = { children: ReactNode };

export default function SocketProvider({ children }: Props): ReactElement {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSocket(null);
            return;
        }

        const instance = io(import.meta.env.VITE_API_BASE_URL, {
            auth: (cb) => { cb({ token: getAccessToken() }); },
        });

        setSocket(instance);

        const handleConnect = (): void => { setIsConnected(true); };
        const handleDisconnect = (): void => { setIsConnected(false); };

        instance.on('connect', handleConnect);
        instance.on('disconnect', handleDisconnect);

        return () => {
            instance.off('connect', handleConnect);
            instance.off('disconnect', handleDisconnect);
            instance.disconnect();
            setSocket(null);
            setIsConnected(false);
        };
    }, [user]);

    const value: SocketContextValueType = { socket, isConnected };

    return <SocketContext value={value}>{children}</SocketContext>;
}