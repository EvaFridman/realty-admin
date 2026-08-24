const photosService = require('../services/listingPhotosService');
const sendResponse = require('../utils/response');

async function list(req, res, next) {
    try {
        const photos = await photosService.listPhotos(req.user, req.params.id);
        sendResponse(res, 200, photos, null, null);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const photos = await photosService.addPhoto(req.user, req.params.id, req.files, req.log);
        sendResponse(res, 201, photos, null, null);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const photo = await photosService.updatePhoto(req.user, req.params.id, req.params.photoId, req.body);
        sendResponse(res, 200, photo, null, null);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await photosService.deletePhoto(req.user, req.params.id, req.params.photoId, req.log);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

async function setCover(req, res, next) {
    try {
        const listingId = req.params.id || req.params.listingId;
        const photo = await photosService.setCover(req.user, listingId, req.params.photoId);
        sendResponse(res, 200, photo, null, null);
    } catch (err) {
        next(err);
    }
}

module.exports = { list, create, update, remove, setCover };