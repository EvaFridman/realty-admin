const jwt = require('jsonwebtoken');
const config = require('../config');
const usersRepo = require('../repositories/usersRepository');
const { UnauthorizedError, NotFoundError } = require('../errors/AppError');

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

    io.on('connection', (socket) => {
        socket.on('ping:check', () => {
            socket.emit('pong:check');
        });
    });
};