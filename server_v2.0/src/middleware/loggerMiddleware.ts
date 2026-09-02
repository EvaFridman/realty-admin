import pinoHttp from "pino-http";
import { randomUUID } from "crypto";
import { logger } from "../tools/logger";

export const loggerMiddleware = pinoHttp({
    logger,
    genReqId: (req, res) => {
        const id = randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
    },
    customAttributeKeys: {
        reqId: 'reqId',
        responseTime: 'responseTime'
    },
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    serializers: {
        req(req) {
            return { method: req.method, url: req.url, reqId: req.id };
        },
        res(res) {
            return { statusCode: res.statusCode };
        },
    },
});