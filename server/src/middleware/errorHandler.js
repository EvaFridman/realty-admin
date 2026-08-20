const { AppError } = require('../errors/AppError');
const multer = require('multer');

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

    if (err instanceof multer.MulterError) {
        const multerErrors = {
            LIMIT_FILE_SIZE: [413, "File is too large, maximum is 5 MB"],
            LIMIT_FILE_COUNT: [400, "Too many files, maximum is 5"],
            LIMIT_UNEXPECTED_FILE: [400, "Unexpected field name. Expected field name is 'photos'"],
        };
        const [status, message] = multerErrors[err.code] ?? [400, "Upload failed"];
        return res.status(status).json({ data: null, error: { message, code: err.code }, meta: null });
    }

    if (err.message === "UNSUPPORTED_FILE_TYPE") {
        return res.status(415).json({
            data: null,
            error: { message: "Only jpeg, png and webp are allowed", code: "UNSUPPORTED_FILE_TYPE" }, meta: null});
    }

    log.error({ err }, 'Unexpected error');
    res.status(500).json({
        data: null,
        error: { message: 'Internal Server Error', details: null },
        meta: null,
    });
}

module.exports = errorHandler;