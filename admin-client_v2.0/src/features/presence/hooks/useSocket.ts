import { useContext } from 'react';

import type { SocketContextValueType } from '../model/index';
import { SocketContext } from '../SocketContext';

export function useSocket(): SocketContextValueType {
    const value = useContext(SocketContext);
    if (!value) throw new Error('useSocket must be used inside SocketProvider');
    return value;
}