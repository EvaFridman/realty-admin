import { db } from "../../database/models";
import type { ListingPhoto } from "../../database/models/listingphoto";
import type { UpdatePhotoBody } from "../schemas/listingPhotosSchema";

export async function findPhotosByListingId(listingId: number): Promise<ListingPhoto[]> {
    return db.ListingPhoto.findAll({ where: { listingId }, order: [['position', 'ASC']] });
}

export async function findPhotoById(id: number): Promise<ListingPhoto | null> {
    return db.ListingPhoto.findByPk(id);
}

export async function updatePhoto(id: number, data: UpdatePhotoBody): Promise<ListingPhoto | null> {
    await db.ListingPhoto.update(data, { where: { id } });
    return findPhotoById(id);
}

export async function deletePhoto(id: number): Promise<number> {
    return db.ListingPhoto.destroy({ where: { id } });
}

export async function setCoverPhoto(listingId: number, photoId: number): Promise<ListingPhoto | null> {
    return db.sequelize.transaction(async (t) => {
        await db.ListingPhoto.update({ isCover: false }, { where: { listingId }, transaction: t, validate: false });
        await db.ListingPhoto.update({ isCover: true }, { where: { id: photoId }, transaction: t, validate: false });
        return db.ListingPhoto.findByPk(photoId, { transaction: t });
    });
}

export async function findPhotoByFileName(fileName: string): Promise<ListingPhoto | null> {
    return db.ListingPhoto.findOne({ where: { fileName } });
}