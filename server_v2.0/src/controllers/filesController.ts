import path from "path";
import type { RequestHandler } from "express";
import { NotFoundError } from "../errors/AppError";

const MAX_AGE = 1000 * 60 * 60 * 24 * 365;

export function sendFile(subfolder: string): RequestHandler {
    return (req, res, next) => {
        const filePath = path.join(__dirname, '..', 'uploads', subfolder, req.fileName!);
        res.sendFile(filePath, { maxAge: MAX_AGE, immutable: true }, (err) => {
            if (err) next(new NotFoundError('File not found'));
        });
    };
}