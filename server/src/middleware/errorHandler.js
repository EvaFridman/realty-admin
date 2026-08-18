const { AppError } = require('../errors/AppError');

function errorHandler(err, req, res, next) {
    const log = req.log || console;

    if (err instanceof AppError) {
        log.warn({ err }, err.message);
        return res.status(err.status).json({
            data: null,
            error: { message: err.message, details: err.details ?? null, code: err.code ?? null },
            meta: null,
        });
    }

    log.error({ err }, 'Unexpected error');
    res.status(500).json({
        data: null,
        error: { message: 'Internal Server Error', details: null },
        meta: null,
    });
}

module.exports = errorHandler;