import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '../config';
import { findUserById } from '../repositories/usersRepository';
import { UnauthorizedError, NotFoundError } from '../errors/AppError';
import { addConnection, removeConnection, getOnlineList, getRoomMembers } from './presenceStore';
import { socketRateLimiter } from './socketRateLimiter';
import type { AppServer, AppSocket } from "./types";

export function registerRealtimeHandlers(io: AppServer): void {
    const ALLOWED_ROOM = /^(queue|listing:\d+)$/;

    io.use(async (socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new UnauthorizedError("No access token"));

        try {
            const payload = jwt.verify(token, APP_CONFIG.jwt.accessSecret);
            if (typeof payload === "string" || !payload.sub) return next(new UnauthorizedError("Invalid access token"));
            const user = await findUserById(Number(payload.sub));
            if (!user) return next(new NotFoundError('User not found'));

            socket.data.user = { id: user.id, role: user.role, email: user.email, name: user.name };
            next();
        } catch {
            next(new UnauthorizedError('Invalid access token'));
        }
    });

    function leaveCurrentRooms(socket: AppSocket): void {
        const currentRooms = Array.from(socket.rooms);
        for (const current of currentRooms) {
            if (current === socket.id) continue;
            socket.leave(current);
            socket.to(current).emit('presence:left', { id: socket.data.user.id });
        }
    }

    io.on('connection', (socket: AppSocket) => {
        const isFirstTab = addConnection(socket);
        socket.emit('presence:online', getOnlineList());
        if (isFirstTab) socket.broadcast.emit('presence:online', getOnlineList());

        socket.use((packet, next) => socketRateLimiter(socket, next));

        socket.on('ping:check', () => socket.emit('pong:check'));

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

            socket.to(room).emit("cursor:moved", { userId: socket.data.user.id, x, y });
        });

        socket.on('presence:request', () => {
            socket.emit('presence:online', getOnlineList());
        });

    });
};