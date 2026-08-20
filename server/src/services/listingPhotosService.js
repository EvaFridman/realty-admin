const photosRepo = require('../repositories/listingPhotosRepository');
const listingsRepo = require('../repositories/listingsRepository');
const { NotFoundError, ForbiddenError } = require('../errors/AppError');
const { sequelize, ListingPhoto } = require('../database/models');
const { toPhotoDto, deletePhysicalFile } = require('./imagesService');
const { ValidationError } = require('../errors/AppError'); 

async function listPhotos(user, listingId) {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to view photos of this listing');
    return photosRepo.findPhotosByListingId(listingId);
}

async function addPhoto(user, listingId, files = []) {
    const cleanUploadedFiles = async () => {
        for (const file of files) {
            await deletePhysicalFile(file.filename);
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
            throw new ValidationError(`Limit exceeded. Already has ${currentPhotosCount} photos. Cannot add ${files.length} more (max 5).`);
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
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to update photo from this listing');
    const photo = await photosRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== Number(listingId)) throw new NotFoundError('Photo not found');
    return photosRepo.updatePhoto(photoId, data);
}

async function deletePhoto(user, listingId, photoId) {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to delete photo from this listing');
    const photo = await photosRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== Number(listingId)) throw new NotFoundError('Photo not found');
    await photosRepo.deletePhoto(photoId);
    if (photo.fileName) await deletePhysicalFile(photo.fileName);
}

async function setCover(user, listingId, photoId) {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to set cover photo for this listing');
    const photo = await photosRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== Number(listingId)) throw new NotFoundError('Photo not found');
    return photosRepo.setCoverPhoto(listingId, photoId);
}

module.exports = { listPhotos, addPhoto, updatePhoto, deletePhoto, setCover };