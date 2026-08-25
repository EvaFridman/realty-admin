const app = require('./src/app');
const logger = require('./logger');
const { createServer } = require("http");
const { Server } = require("socket.io");
const registerSocketHandlers = require('./src/realtime/index.js')

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173", credentials: true },
});

registerSocketHandlers(io);

httpServer.listen(PORT, () => logger.info(`http://localhost:${PORT}`));