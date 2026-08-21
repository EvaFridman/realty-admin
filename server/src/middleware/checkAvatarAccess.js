const usersRepo = require('../repositories/usersRepository');
const { NotFoundError, ForbiddenError } = require('../errors/AppError');

const checkAvatarAccess = async (req, res, next) => {
    try {
        const currentUser = await usersRepo.findUserById(req.params.id);
        if (!currentUser) return next(new NotFoundError('User not found'));
        
        const isSelf = currentUser.id === req.user.id;
        const isModerator = req.user.role === 'moderator';
        
        if (!isSelf && !isModerator) {
            return next(new ForbiddenError('Not enough rights to modify avatar of this user'));
        }
        
        req.currentUser = currentUser;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = checkAvatarAccess;