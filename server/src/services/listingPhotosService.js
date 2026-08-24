const photosRepo = require('../repositories/listingPhotosRepository');
const { NotFoundError, ValidationError, ConflictError } = require('../errors/AppError');
const { sequelize, ListingPhoto } = require('../../database/models');
const { toPhotoDto, deletePhysicalFile } = require('./imagesService');
const defaultLogger = require('../../logger');

async function listPhotos(user, listingId) {
    return photosRepo.findPhotosByListingId(listingId);
}

async function addPhoto(user, listingId, files = [], log = defaultLogger) {
    const cleanUploadedFiles = async () => {
        for (const file of files) {
            await deletePhysicalFile(file.filename, 'photos', log);
        }
    };

    if (!files || files.length === 0) throw new ValidationError('No files provided');

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

        const photos = [];
        for (const file of files) {
            const newPhoto = await ListingPhoto.create({ listingId, fileName: file.filename, sizeBytes: file.size, externalUrl: null }, { transaction: t });
            photos.push(newPhoto);
        }
        await t.commit();
        return photos.map(photo => toPhotoDto(photo));

    } catch (error) {
        await t.rollback();
        await cleanUploadedFiles();
        throw error;
    }
}

async function updatePhoto(user, listingId, photoId, data) {
    const photo = await photosRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== Number(listingId)) throw new NotFoundError('Photo not found');
    return photosRepo.updatePhoto(photoId, data);
}

async function deletePhoto(user, listingId, photoId, log = defaultLogger) {
    const photo = await photosRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== Number(listingId)) throw new NotFoundError('Photo not found');
    await photosRepo.deletePhoto(photoId);
    if (photo.fileName) await deletePhysicalFile(photo.fileName, 'photos', log);
}

async function setCover(user, listingId, photoId) {
    const photo = await photosRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== Number(listingId)) throw new NotFoundError('Photo not found');
    return photosRepo.setCoverPhoto(listingId, photoId);
}

module.exports = { listPhotos, addPhoto, updatePhoto, deletePhoto, setCover };