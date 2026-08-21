const userAvatarRouter = require('express').Router();
const userAvatarController = require('../controllers/userAvatarController');
const { verifyAccessToken } = require('../middleware/auth');
const avatarUpload = require('../middleware/uploadEntities/userAvatar');
const checkAvatarAccess = require('../middleware/checkAvatarAccess');
const { validate } = require('../middleware/validate');
const { pathIdSchema } = require('../schemas/pathSchema');

userAvatarRouter.use(verifyAccessToken);

userAvatarRouter.post('/:id/avatar', validate(pathIdSchema, 'params'), checkAvatarAccess,
(req, res, next) => {
    avatarUpload(req, res, (err) => {
        if (err) return next(err);
        next();
    });
},
userAvatarController.create);

userAvatarRouter.delete('/:id/avatar', checkAvatarAccess, userAvatarController.remove);

module.exports = userAvatarRouter;