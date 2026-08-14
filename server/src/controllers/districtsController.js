const districtsService = require('../services/districtsService');
const sendResponse = require('../utils/response');

async function list(req, res, next) {
    try {
        const districts = await districtsService.listDistricts();
        sendResponse(res, 200, districts, null, null);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const district = await districtsService.getDistrictById(req.params.id);
        sendResponse(res, 200, district, null, null);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const district = await districtsService.createDistrict(req.body);
        sendResponse(res, 201, district, null, null);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const district = await districtsService.updateDistrict(req.params.id, req.body);
        sendResponse(res, 200, district, null, null);
    } catch (err) {
        next(err);
    }
}

module.exports = { list, getById, create, update };