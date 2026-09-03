import path from "path";
import type { Request, RequestHandler } from "express";
import { getPhotoWithListing } from "../services/filesService";
import { NotFoundError } from "../errors/AppError";

function getSafeFileName(req: Request): string {
    const { fileName } = req.params;
    if (typeof fileName !== "string") throw new NotFoundError("File not found");
    return path.basename(fileName);
}

export const loadPhotoListing: RequestHandler = async (req, res, next) => {
    try {
        const safeFileName = getSafeFileName(req);
        const result = await getPhotoWithListing(safeFileName);
        req.listing = result.listing;
        req.fileName = safeFileName;
        next();
    } catch (err) {
        next(err);
    }
};

export const loadAvatarFile: RequestHandler = (req, res, next) => {
    try {
        req.fileName = getSafeFileName(req);
        next();
    } catch (err) {
        next(err);
    }
};