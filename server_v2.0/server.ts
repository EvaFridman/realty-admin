import { createServer } from "http";
import { Server } from "socket.io";
import app from "./src/app";
import { APP_CONFIG } from "./src/config";
import { registerRealtimeHandlers } from "./src/realtime";
import type { AppServer } from "./src/realtime/types";
import { logger } from "./src/tools/logger";

const httpServer = createServer(app);
const io: AppServer = new Server(httpServer, {
    cors: { origin: "http://localhost:5173", credentials: true },
});

registerRealtimeHandlers(io);
httpServer.listen(APP_CONFIG.port, () => logger.info(`http://localhost:${APP_CONFIG.port}`));