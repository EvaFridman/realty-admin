import type { AuthUser } from "../../types/index";
import * as listingsPhotoRepo from "../repositories/listingPhotosRepository";
import { NotFoundError, ConflictError, ValidationError } from "../errors/AppError";
import { sequelize } from "../../database/models";
import { ListingPhoto } from "../../database/models/listingphoto";
import { toPhotoDto, deletePhysicalFile } from "./imagesService";
import type { Logger } from "pino";
import { logger } from "../tools/logger";
import type { UpdatePhotoBody } from "../schemas/listingPhotosSchema";

type PhotoDto = NonNullable<ReturnType<typeof toPhotoDto>>;

export async function listPhotos(user: AuthUser, listingId: number): Promise<ListingPhoto[]> {
    return listingsPhotoRepo.findPhotosByListingId(listingId);
}

export async function addPhoto(user: AuthUser, listingId: number, files: Express.Multer.File[] = [], log: Logger = logger): Promise<PhotoDto[]> {
    const cleanUploadedFiles = async (): Promise<void> => {
        for (const file of files) {
            await deletePhysicalFile(file.filename, 'photos', log);
        }
    };

    if (files.length === 0) throw new ValidationError('No files provided');

    const t = await sequelize.transaction();

    try {
        const currentPhotosCount = await ListingPhoto.count({
            where: { listingId },
            transaction: t
        });

        if (currentPhotosCount + files.length > 5) {
            await cleanUploadedFiles();
            throw new ConflictError(`Limit exceeded. Already has ${currentPhotosCount} photos. Cannot add ${files.length} more (max 5).`);
        }

        const photos: ListingPhoto[] = [];
        for (const file of files) {
            const newPhoto = await ListingPhoto.create({ listingId, fileName: file.filename, sizeBytes: file.size, externalUrl: null }, { transaction: t });
            photos.push(newPhoto);
        }
        await t.commit();
        return photos.map(photo => toPhotoDto(photo)).filter((photo): photo is PhotoDto => photo !== null);

    } catch (error) {
        await t.rollback();
        await cleanUploadedFiles();
        throw error;
    }
}

export async function updatePhoto(user: AuthUser, listingId: number, photoId: number, data: UpdatePhotoBody): Promise<ListingPhoto> {
    const photo = await listingsPhotoRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== listingId) throw new NotFoundError('Photo not found');
    const updatedPhoto = await listingsPhotoRepo.updatePhoto(photoId, data);
    if (!updatedPhoto) throw new NotFoundError("Photo not found");
    return updatedPhoto;
}

export async function deletePhoto(user: AuthUser, listingId: number, photoId: number, log: Logger = logger): Promise<void> {
    const photo = await listingsPhotoRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== listingId) throw new NotFoundError('Photo not found');
    await listingsPhotoRepo.deletePhoto(photoId);
    if (photo.fileName) await deletePhysicalFile(photo.fileName, 'photos', log);
}

export async function setCover(user: AuthUser, listingId: number, photoId: number): Promise<ListingPhoto> {
    const photo = await listingsPhotoRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== listingId) throw new NotFoundError("Photo not found");
    const updatedPhoto = await listingsPhotoRepo.setCoverPhoto(listingId, photoId);
    if (!updatedPhoto) throw new NotFoundError("Photo not found");
    return updatedPhoto;
}