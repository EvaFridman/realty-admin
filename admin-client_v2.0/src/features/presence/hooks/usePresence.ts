import { useEffect, useState } from 'react';

import type { PresenceUserType } from '../model';

import { useSocket } from './useSocket';

type LeftUserType = { id: number };

export function useOnlineUsers(): PresenceUserType[] {
    const { socket, isConnected } = useSocket();
    const [onlineUsers, setOnlineUsers] = useState<PresenceUserType[]>([]);

    useEffect(() => {
        if (!socket) return;

        const handler = (list: PresenceUserType[]): void => {
            setOnlineUsers(list);
        };

        socket.on('presence:online', handler);

        if (socket.connected) {
            socket.emit('presence:request');
        }

        const handleConnect = (): void => {
            socket.emit('presence:request');
        };

        socket.on('connect', handleConnect);

        return () => {
            socket.off('presence:online', handler);
            socket.off('connect', handleConnect);
        };
    }, [socket, isConnected]);

    return onlineUsers;
}

export function useRoomPresence(): PresenceUserType[] {
    const { socket } = useSocket();
    const [members, setMembers] = useState<PresenceUserType[]>([]);

    useEffect(() => {
        if (!socket) return;

        const handleRoomList = (list: PresenceUserType[]): void => { setMembers(list); };
        const handleJoined = (user: PresenceUserType): void => { setMembers((prev) =>
            prev.some((m) => m.id === user.id) ? prev : [...prev, user]
        ); };
        const handleLeft = ({ id }: LeftUserType): void => { setMembers((prev) => prev.filter((m) => m.id !== id)); };

        socket.on('presence:room', handleRoomList);
        socket.on('presence:joined', handleJoined);
        socket.on('presence:left', handleLeft);

        return () => {
            socket.off('presence:room', handleRoomList);
            socket.off('presence:joined', handleJoined);
            socket.off('presence:left', handleLeft);
            setMembers([]);
        };
    }, [socket]);

    return members;
}