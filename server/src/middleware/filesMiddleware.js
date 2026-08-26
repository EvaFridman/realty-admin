const path = require('path');
const filesService = require('../services/filesService');

async function loadPhotoListing(req, res, next) {
    try {
        const fileName = path.basename(req.params.fileName);
        const result = await filesService.getPhotoWithListing(fileName);
        req.listing = result.listing;
        req.fileName = fileName;
        next();
    } catch (err) {
        next(err);
    }
}

function loadAvatarFile(req, res, next) {
    req.fileName = path.basename(req.params.fileName);
    next();
}

module.exports = { loadPhotoListing, loadAvatarFile };