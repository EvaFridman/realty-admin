const listingsRepo = require('../repositories/listingsRepository');
const photosRepo = require('../repositories/listingPhotosRepository');
const { NotFoundError } = require('../errors/AppError');

async function getPhotoWithListing(fileName) {
    const photo = await photosRepo.findPhotoByFileName(fileName);
    if (!photo) throw new NotFoundError('Photo not found');
    const listing = await listingsRepo.findListingById(photo.listingId);
    if (!listing) throw new NotFoundError('Photo not found');

    return { photo, listing };
}

module.exports = { getPhotoWithListing };