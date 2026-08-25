module.exports = function registerSocketHandlers(io) {
    io.on('connection', (socket) => {
        socket.on('ping:check', () => {
            socket.emit('pong:check');
        });
    });
};