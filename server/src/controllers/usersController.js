const usersService = require('../services/usersService');
const sendResponse = require('../utils/response');
const imagesService = require('../services/imagesService');

const toUserDto = (user) => {
    const rawUserData = user.get ? user.get({ plain: true }) : user;
    const { passwordHash, avatarFileName, ...userData } = rawUserData;

    return {
        ...userData,
        avatarUrl: avatarFileName && imagesService.buildImageUrl('avatars', avatarFileName)
    };
};

async function list(req, res, next) {
    try {
        const { users, meta } = await usersService.listUsers(req.query);
        sendResponse(res, 200, users.map(toUserDto), null, meta);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const user = await usersService.getUserById(req.params.id);
        sendResponse(res, 200, toUserDto(user), null, null);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const user = await usersService.createUser(req.body);
        sendResponse(res, 201, toUserDto(user), null, null);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const user = await usersService.updateUser(req.params.id, req.body);
        sendResponse(res, 200, toUserDto(user), null, null);
    } catch (err) {
        next(err);
    }
}

module.exports = { list, getById, create, update };