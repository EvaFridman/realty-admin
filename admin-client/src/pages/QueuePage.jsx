import ListingsSection from '../features/listings/queue/ListingsSection';
import { useEffect } from 'react';
import { useSocket } from '../realtime/SocketProvider';
import { useRoomPresence } from '../realtime/usePresence';
import PresenceBar from '../widgets/PresenceBar';

export default function QueuePage() {
    const { socket, isConnected } = useSocket();
    const roomMembers = useRoomPresence();

    useEffect(() => {
        if (!isConnected || !socket) return;
        socket.emit('room:join', 'queue');
        return () => socket.emit('room:leave');
    }, [socket, isConnected]);

    return (
        <>
            <PresenceBar members={roomMembers} />
            <ListingsSection statusFilter="moderation" />
        </>
    );
}