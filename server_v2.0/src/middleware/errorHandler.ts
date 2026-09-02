import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { AppError } from "../errors/AppError";
import { sendResponse } from "../utils/response";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const log = req.log;

    if (err instanceof AppError) {
        if (err.status === 502) log.error({ err }, err.message);
        else log.warn({ err }, err.message);

        const detailsToShow = err.status === 502 ? null : (err.details ?? null);
        
        return sendResponse(res, err.status, null, { message: err.message, details: detailsToShow, code: err.code ?? null }, null);
    }

    if (err instanceof multer.MulterError) {
        const multerErrors: Record<string, [number, string]> =  {
            LIMIT_FILE_SIZE: [413, "File is too large, maximum is 5 MB"],
            LIMIT_FILE_COUNT: [400, "Too many files, maximum is 5"],
            LIMIT_UNEXPECTED_FILE: [400, "Unexpected field name. Expected field name is 'photos'"],
        };
        const [status, message] = multerErrors[err.code] ?? [400, "Upload failed"];
        return sendResponse(res, status, null, { message, code: err.code }, null);
    }

    if (err.message === "UNSUPPORTED_FILE_TYPE") {
        return sendResponse(res, 415, null, { message: "Only jpeg, png and webp are allowed", code: "UNSUPPORTED_FILE_TYPE" }, null);
    }

    log.error({ err }, 'Unexpected error');
    return sendResponse(res, 500, null, { message: "Internal server error" }, null);
}