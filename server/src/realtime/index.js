const jwt = require('jsonwebtoken');
const config = require('../config');
const usersRepo = require('../repositories/usersRepository');
const { UnauthorizedError, NotFoundError } = require('../errors/AppError');
const { addConnection, removeConnection, getOnlineList, getRoomMembers } = require('./presenceStore');
const socketRateLimiter = require('./socketRateLimiter');

module.exports = function registerRealtimeHandlers(io) {
    io.use(async (socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new UnauthorizedError("No access token"));

        try {
            const payload = jwt.verify(token, config.jwt.accessSecret);
            const user = await usersRepo.findUserById(payload.sub);
            if (!user) return next(new NotFoundError('User not found'));

            socket.data.user = { id: user.id, role: user.role, email: user.email, name: user.name };
            next();
        } catch (error) {
            next(new UnauthorizedError('Invalid access token'));
        }
    });

    const ALLOWED_ROOM = /^(queue|listing:\d+)$/;

    function leaveCurrentRooms(socket) {
        const currentRooms = Array.from(socket.rooms);
        for (const current of currentRooms) {
            if (current === socket.id) continue;
            socket.leave(current);
            socket.to(current).emit('presence:left', { id: socket.data.user.id });
        }
    }

    io.on('connection', (socket) => {
        const isFirstTab = addConnection(socket);
        socket.emit('presence:online', getOnlineList());
        if (isFirstTab) socket.broadcast.emit('presence:online', getOnlineList());

        socket.use((packet, next) => socketRateLimiter(socket, next));

        socket.on('ping:check', () => {
            socket.emit('pong:check');
        });

        socket.on("room:join", (room) => {
            if (!ALLOWED_ROOM.test(room)) return;

            leaveCurrentRooms(socket);
            socket.join(room);

            socket.to(room).emit('presence:joined', socket.data.user);
            socket.emit('presence:room', getRoomMembers(io, room, socket.id));
        });

        socket.on('room:leave', () => {
            leaveCurrentRooms(socket);
        });

        socket.on('disconnecting', () => {
            leaveCurrentRooms(socket);
        });

        socket.on('disconnect', () => {
            const wasLastTab = removeConnection(socket);
            if (wasLastTab) io.emit('presence:online', getOnlineList());
        });

        socket.on("cursor:move", ({ room, x, y }) => {
            if (!socket.rooms.has(room)) return;
            if (typeof x !== "number" || x < 0 || x > 1) return;
            if (typeof y !== "number" || y < 0 || y > 1) return;

            socket.to(room).emit("cursor:moved", {
                userId: socket.data.user.id,
                email: socket.data.user.email,
                x, y,
            });
        });

        socket.on('presence:request', () => {
            socket.emit('presence:online', getOnlineList());
        });

    });
};