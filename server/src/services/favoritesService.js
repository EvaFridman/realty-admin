const favoritesRepo = require('../repositories/favoritesRepository');
const usersRepo = require('../repositories/usersRepository');
const listingsRepo = require('../repositories/listingsRepository');
const { NotFoundError, ConflictError, ForbiddenError } = require('../errors/AppError');

async function listFavorites(user, userId) {
    if (user.id !== Number(userId) && user.role !== 'moderator') throw new ForbiddenError("Not enough rights to view this user's favorites");
    const userExists = await usersRepo.findUserById(userId);
    if (!userExists) throw new NotFoundError('User not found');
    return favoritesRepo.findFavoritesByUserId(userId);
}

async function addFavorite(user, userId, listingId, note) {
    if (user.id !== Number(userId) && user.role !== 'moderator') throw new ForbiddenError('Not enough rights to add favorite for this user');
    const userExists = await usersRepo.findUserById(userId);
    if (!userExists) throw new NotFoundError('User not found');

    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');

    const existing = await favoritesRepo.findFavorite(userId, listingId);
    if (existing) throw new ConflictError('Listing is already in favorites');

    return favoritesRepo.createFavorite(userId, listingId, note);
}

async function updateFavorite(user, userId, listingId, note) {
    if (user.id !== Number(userId) && user.role !== 'moderator') throw new ForbiddenError('Not enough rights to update this favorite');
    const existing = await favoritesRepo.findFavorite(userId, listingId);
    if (!existing) throw new NotFoundError('Favorite not found');
    return favoritesRepo.updateFavoriteNote(userId, listingId, note);
}

async function removeFavorite(user, userId, listingId) {
    if (user.id !== Number(userId) && user.role !== 'moderator') throw new ForbiddenError('Not enough rights to delete this favorite');
    const existing = await favoritesRepo.findFavorite(userId, listingId);
    if (!existing) throw new NotFoundError('Favorite not found');
    await favoritesRepo.deleteFavorite(userId, listingId);
}

module.exports = { listFavorites, addFavorite, updateFavorite, removeFavorite };