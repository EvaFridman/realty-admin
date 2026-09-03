import fs from "fs/promises";
import path from "path";
import type { Logger } from "pino";
import type { ListingPhoto } from "../../database/models/listingphoto";
import { logger } from "../tools/logger";
import { APP_CONFIG } from "../config";

export const buildImageUrl = (folder: string, fileName: string): string => {
    return `${APP_CONFIG.uploadBaseUrl}/${folder}/${fileName}`.replace('//', '/');
};

export const toPhotoDto = (photo: ListingPhoto | null): {id: number; url: string; sizeBytes: number | null} | null => {
    if (!photo) return null;
    const rawPhotoData = photo.get({ plain: true });
    const clientUrl = rawPhotoData.externalUrl ?? (rawPhotoData.fileName ? buildImageUrl("photos", rawPhotoData.fileName) : null);
    if (!clientUrl) return null;

    return {
        id: rawPhotoData.id,
        url: clientUrl,
        sizeBytes: rawPhotoData.sizeBytes,
    };
};

export const deletePhysicalFile = async (fileName: string | null | undefined, subfolder: string = 'photos', log: Logger = logger): Promise<void> => {
    if (!fileName) return;
    const filePath = path.join(__dirname, '..', 'uploads', subfolder, fileName);

    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        log.info({ fileName, subfolder }, 'File deleted successfully');
    } catch (error) {
        const code = error instanceof Error ? (error as NodeJS.ErrnoException).code : "UnknownError";
        log.warn({ fileName, subfolder, code }, 'Orphan file cleanup failed');
    }
};