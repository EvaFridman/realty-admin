const viewingsService = require('../services/viewingsService');
const sendResponse = require('../utils/response');

async function list(req, res, next) {
    try {
        const viewings = await viewingsService.listViewings(req.params.id);
        sendResponse(res, 200, viewings, null, null);
    } catch (err) {
        next(err);
    }
}

async function listAll(req, res, next) {
    try {
        const { data, meta } = await viewingsService.listAllViewings(req.validatedQuery);
        sendResponse(res, 200, data, null, meta);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const viewing = await viewingsService.createViewing(req.params.id, req.body, req.log);
        sendResponse(res, 201, viewing, null, null);
    } catch (err) {
        next(err);
    }
}

async function changeStatus(req, res, next) {
    try {
        const viewing = await viewingsService.changeStatus(req.params.id, req.body.status, req.log);
        sendResponse(res, 200, viewing, null, null);
    } catch (err) {
        next(err);
    }
}

module.exports = { list, create, changeStatus, listAll };