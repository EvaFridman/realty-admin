const usersRepo = require('../repositories/usersRepository');
const imagesService = require('../services/imagesService');
const sendResponse = require('../utils/response');
const { ValidationError } = require('../errors/AppError');

const toUserDto = (user) => {
    const rawUserData = user.get ? user.get({ plain: true }) : user;
    const { avatarFileName, ...userData } = rawUserData;
    return {
        ...userData,
        avatarUrl: avatarFileName && imagesService.buildImageUrl('avatars', avatarFileName)
    };
};

async function create(req, res, next) {
    try {
        if (!req.file) throw new ValidationError('File is required');
        const user = req.currentUser;
        const oldFileName = user.avatarFileName;
        const updatedUser = await usersRepo.updateUser(user.id, { avatarFileName: req.file.filename });
        if (oldFileName) await imagesService.deletePhysicalFile(oldFileName, 'avatars', req.log); 
        sendResponse(res, 200, toUserDto(updatedUser), null, null);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const user = req.currentUser;
        const oldFileName = user.avatarFileName;
        if (!oldFileName) return sendResponse(res, 200, toUserDto(user), null, null);
        const updatedUser = await usersRepo.updateUser(user.id, { avatarFileName: null });
        await imagesService.deletePhysicalFile(oldFileName, 'avatars', req.log);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { create, remove };