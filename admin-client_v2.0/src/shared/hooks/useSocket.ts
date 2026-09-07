import { useContext } from 'react';

import type { SocketContextValueType } from '@/features/presence';

import { SocketContext } from '../../app/presence/SocketContext';

export function useSocket(): SocketContextValueType {
    const value = useContext(SocketContext);
    if (!value) throw new Error('useSocket must be used inside SocketProvider');
    return value;
}