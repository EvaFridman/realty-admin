const pinoHttp = require('pino-http');
const { randomUUID } = require('crypto');
const logger = require('../../logger');

const loggerMiddleware = pinoHttp({
    logger,
    genReqId: (req, res) => {
        const id = randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
    },
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    serializers: {
        req(req) {
            return { method: req.method, url: req.url, id: req.id };
        },
        res(res) {
            return { statusCode: res.statusCode };
        },
    },
});

module.exports = loggerMiddleware;