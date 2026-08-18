const listingsService = require('../services/listingsService');
const sendResponse = require('../utils/response');

async function list(req, res, next) {
    try {
        const { data, meta } = await listingsService.listListings(req.user, req.validatedQuery);
        sendResponse(res, 200, data, null, meta);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const listing = await listingsService.getListingById(req.user, req.params.id);
        sendResponse(res, 200, listing, null, null);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const listing = await listingsService.createListing(req.user, req.body);
        sendResponse(res, 201, listing, null, null);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const listing = await listingsService.updateListing(req.user, req.params.id, req.body);
        sendResponse(res, 200, listing, null, null);
    } catch (err) {
        next(err);
    }
}

async function changeStatus(req, res, next) {
    try {
        const { status, rejectionReason } = req.body;
        const listing = await listingsService.changeStatus(req.params.id, status, rejectionReason, req.log);
        sendResponse(res, 200, listing, null, null);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await listingsService.deleteListing(req.user, req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { list, getById, create, update, changeStatus, remove };