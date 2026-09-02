import path from "path";
import type { RequestHandler } from "express";
import { getPhotoWithListing } from "../services/filesService";
import { NotFoundError } from "../errors/AppError";

export const loadPhotoListing: RequestHandler = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        if (typeof fileName !== "string") return next(new NotFoundError("File not found"));
        const safeFileName = path.basename(fileName);
        const result = await getPhotoWithListing(safeFileName);
        req.listing = result.listing;
        req.fileName = safeFileName;
        next();
    } catch (err) {
        next(err);
    }
};

export const loadAvatarFile: RequestHandler = (req, res, next) => {
    const { fileName } = req.params;
    if (typeof fileName !== "string") return next(new NotFoundError("File not found"));
    req.fileName = path.basename(fileName);
    next();
};