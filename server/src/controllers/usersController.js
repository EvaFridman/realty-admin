const usersService = require('../services/usersService');
const sendResponse = require('../utils/response');

async function list(req, res, next) {
    try {
        const users = await usersService.listUsers();
        sendResponse(res, 200, users, null, null);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const user = await usersService.getUserById(req.params.id);
        sendResponse(res, 200, user, null, null);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const user = await usersService.createUser(req.body);
        sendResponse(res, 201, user, null, null);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const user = await usersService.updateUser(req.params.id, req.body);
        sendResponse(res, 200, user, null, null);
    } catch (err) {
        next(err);
    }
}

module.exports = { list, getById, create, update };