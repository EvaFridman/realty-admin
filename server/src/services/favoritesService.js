const favoritesRepo = require('../repositories/favoritesRepository');
const usersRepo = require('../repositories/usersRepository');
const listingsRepo = require('../repositories/listingsRepository');
const { NotFoundError, ConflictError } = require('../errors/AppError');

async function listFavorites(userId) {
    const user = await usersRepo.findUserById(userId);
    if (!user) throw new NotFoundError('User not found');
    return favoritesRepo.findFavoritesByUserId(userId);
}

async function addFavorite(userId, listingId, note) {
    const user = await usersRepo.findUserById(userId);
    if (!user) throw new NotFoundError('User not found');

    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');

    const existing = await favoritesRepo.findFavorite(userId, listingId);
    if (existing) throw new ConflictError('Listing is already in favorites');

    return favoritesRepo.createFavorite(userId, listingId, note);
}

async function updateFavorite(userId, listingId, note) {
    const existing = await favoritesRepo.findFavorite(userId, listingId);
    if (!existing) throw new NotFoundError('Favorite not found');
    return favoritesRepo.updateFavoriteNote(userId, listingId, note);
}

async function removeFavorite(userId, listingId) {
    const existing = await favoritesRepo.findFavorite(userId, listingId);
    if (!existing) throw new NotFoundError('Favorite not found');
    await favoritesRepo.deleteFavorite(userId, listingId);
}

module.exports = { listFavorites, addFavorite, updateFavorite, removeFavorite };