import { useEffect, useState } from 'react';
import { useSocket } from './SocketProvider.jsx';

export function useOnlineUsers() {
    const { socket, isConnected } = useSocket();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const handler = (list) => {
            setOnlineUsers(list);
        };

        socket.on('presence:online', handler);

        if (socket.connected) {
            socket.emit('presence:request');
        }

        const handleConnect = () => {
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

export function useRoomPresence() {
    const { socket } = useSocket();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const handleRoomList = (list) => setMembers(list);
        const handleJoined = (user) => setMembers((prev) =>
            prev.some((m) => m.id === user.id) ? prev : [...prev, user]
        );
        const handleLeft = ({ id }) => setMembers((prev) => prev.filter((m) => m.id !== id));

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