const photosRepo = require('../repositories/listingPhotosRepository');
const listingsRepo = require('../repositories/listingsRepository');
const { NotFoundError } = require('../errors/AppError');

async function listPhotos(listingId) {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');
    return photosRepo.findPhotosByListingId(listingId);
}

async function addPhoto(listingId, data) {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');
    return photosRepo.createPhoto(listingId, data);
}

async function updatePhoto(listingId, photoId, data) {
    const photo = await photosRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== Number(listingId)) throw new NotFoundError('Photo not found');
    return photosRepo.updatePhoto(photoId, data);
}

async function deletePhoto(listingId, photoId) {
    const photo = await photosRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== Number(listingId)) throw new NotFoundError('Photo not found');
    await photosRepo.deletePhoto(photoId);
}

async function setCover(listingId, photoId) {
    const photo = await photosRepo.findPhotoById(photoId);
    if (!photo || photo.listingId !== Number(listingId)) throw new NotFoundError('Photo not found');
    return photosRepo.setCoverPhoto(listingId, photoId);
}

module.exports = { listPhotos, addPhoto, updatePhoto, deletePhoto, setCover };