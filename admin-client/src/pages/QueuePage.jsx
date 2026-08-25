import ListingsSection from '../features/listings/queue/ListingsSection';
import { useEffect } from 'react';
import { useSocket } from '../realtime/SocketProvider';

export default function QueuePage() {
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!isConnected || !socket) return;
        socket.emit('room:join', 'queue');
    }, [socket, isConnected]);

    return <ListingsSection statusFilter="moderation" />;
}