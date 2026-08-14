const { Favorite, Listing } = require('../../database/models');

async function findFavoritesByUserId(userId) {
    return Favorite.findAll({ where: { userId }, include: [{ model: Listing, as: 'listing' }] });
}

async function findFavorite(userId, listingId) {
    return Favorite.findOne({ where: { userId, listingId } });
}

async function createFavorite(userId, listingId, note) {
    return Favorite.create({ userId, listingId, note, addedAt: new Date() });
}

async function updateFavoriteNote(userId, listingId, note) {
    await Favorite.update({ note }, { where: { userId, listingId } });
    return findFavorite(userId, listingId);
}

async function deleteFavorite(userId, listingId) {
    return Favorite.destroy({ where: { userId, listingId } });
}

module.exports = { findFavoritesByUserId, findFavorite, createFavorite, updateFavoriteNote, deleteFavorite };