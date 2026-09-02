import type { AppServer, AppSocket, SocketUser } from "./types";

type OnlineUsersEntry = {
    user: SocketUser;
    socketIds: Set<string>;
};

const onlineUsers = new Map<number, OnlineUsersEntry>();

export function addConnection(socket: AppSocket): boolean {
    const { id, name, role, email } = socket.data.user;
    const entry = onlineUsers.get(id) ?? { user: { id, name, role, email }, socketIds: new Set<string>() };
    entry.socketIds.add(socket.id);
    onlineUsers.set(id, entry);
    return entry.socketIds.size === 1;
}

export function removeConnection(socket: AppSocket): boolean {
    const { id } = socket.data.user;
    const entry = onlineUsers.get(id);
    if (!entry) return false;
    entry.socketIds.delete(socket.id);
    if (entry.socketIds.size === 0) {
        onlineUsers.delete(id);
        return true;
    }
    return false;
}

export function getOnlineList(): SocketUser[] {
    return Array.from(onlineUsers.values()).map(({ user }) => user);
}

export function getRoomMembers(io: AppServer, room: string, excludeSocketId: string | null = null): SocketUser[] {
    const socketIds = io.sockets.adapter.rooms.get(room) ?? new Set<string>();
    const inRoomUsers = new Map<number, SocketUser>();

    for (const socketId of socketIds) {
        if (socketId === excludeSocketId) continue;
        const memberSocket = io.sockets.sockets.get(socketId);
        if (!memberSocket?.data?.user) continue;
        inRoomUsers.set(memberSocket.data.user.id, memberSocket.data.user);
    }

    return Array.from(inRoomUsers.values());
}