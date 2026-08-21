const usersRepo = require('../repositories/usersRepository');
const { deletePhysicalFile, buildImageUrl } = require('../services/imagesService');
const sendResponse = require('../utils/response');

const toUserDto = (user) => {
    const rawUserData = user.get ? user.get({ plain: true }) : user;
    return {
        id: rawUserData.id,
        name: rawUserData.name,
        email: rawUserData.email,
        role: rawUserData.role,
        avatarUrl: rawUserData.avatarFileName ? buildImageUrl('avatars', rawUserData.avatarFileName) : null
    };
};

async function create(req, res, next) {
    try {
        if (!req.file) throw new Error('File is required');
        const user = req.currentUser;
        const oldFileName = user.avatarFileName;
        const updatedUser = await usersRepo.updateUser(user.id, { avatarFileName: req.file.filename });
        if (oldFileName) await deletePhysicalFile(oldFileName, 'avatars'); 
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
        await deletePhysicalFile(oldFileName, 'avatars');
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { create, remove };