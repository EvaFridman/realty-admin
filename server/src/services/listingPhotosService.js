const photosRepo = require('../repositories/listingPhotosRepository');
const listingsRepo = require('../repositories/listingsRepository');
const { NotFoundError, ForbiddenError } = require('../errors/AppError');

async function listPhotos(user, listingId) {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to view photos of this listing');
    return photosRepo.findPhotosByListingId(listingId);
}

async function addPhoto(user, listingId, data) {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to add photo to this listing');
    return photosRepo.createPhoto(listingId, data);
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