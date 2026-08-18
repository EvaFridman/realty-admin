const favoritesService = require('../services/favoritesService');
const sendResponse = require('../utils/response');

async function list(req, res, next) {
    try {
        const favorites = await favoritesService.listFavorites(req.user, req.params.id);
        sendResponse(res, 200, favorites, null, null);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const favorite = await favoritesService.addFavorite(req.user, req.params.id, req.body.listingId, req.body.note);
        sendResponse(res, 201, favorite, null, null);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const favorite = await favoritesService.updateFavorite(req.user, req.params.id, req.params.listingId, req.body.note);
        sendResponse(res, 200, favorite, null, null);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await favoritesService.removeFavorite(req.user, req.params.id, req.params.listingId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { list, create, update, remove };