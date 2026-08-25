const onlineUsers = new Map();

function addConnection(socket) {
    const { id, name, role } = socket.data.user;
    const entry = onlineUsers.get(id) ?? { user: { id, name, role }, socketIds: new Set() };
    entry.socketIds.add(socket.id);
    onlineUsers.set(id, entry);
    return entry.socketIds.size === 1;
}

function removeConnection(socket) {
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

function getOnlineList() {
    return Array.from(onlineUsers.values()).map(({ user }) => user);
}

function getRoomMembers(io, room, excludeSocketId = null) {
    const socketIds = io.sockets.adapter.rooms.get(room) ?? new Set();
    const inRoomUsers = new Map(); // userId -> user, дедуп по пользователю

    for (const socketId of socketIds) {
        if (socketId === excludeSocketId) continue;
        const memberSocket = io.sockets.sockets.get(socketId);
        if (!memberSocket?.data?.user) continue;
        inRoomUsers.set(memberSocket.data.user.id, memberSocket.data.user);
    }

    return Array.from(inRoomUsers.values());
}

module.exports = { addConnection, removeConnection, getOnlineList, getRoomMembers };