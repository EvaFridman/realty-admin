import { useEffect, type ReactNode } from 'react';


import { PresenceBar } from '@/widgets/presence';

import { useRoomPresence , useCursorBroadcast , CursorLayer } from '@/features/presence';

import { useSocket } from '@/shared/hooks/useSocket';

import ListingsPage from '../listings/ListingsPage';


export default function QueuePage(): ReactNode {
    const { socket, isConnected } = useSocket();
    const roomMembers = useRoomPresence();

    useCursorBroadcast('queue');

    useEffect(() => {
        if (!isConnected || !socket) return;
    
        socket.emit('room:join', 'queue');
    
        return () => {
            socket.emit('room:leave');
        };
    }, [socket, isConnected]);

    return (
        <>
            <CursorLayer />
            <PresenceBar members={roomMembers} />
            <ListingsPage statusFilter="moderation" />
        </>
    );
}