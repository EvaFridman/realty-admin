import type { Socket } from 'socket.io-client';

import type { UserRoleType } from '@/entities/user';

export type SocketContextValueType = {
    socket: Socket | null;
    isConnected: boolean;
};

export type PresenceUserType = {
    id: number;
    role: UserRoleType;
    email: string;
    name: string;
};