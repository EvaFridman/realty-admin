import { findUserById } from '../repositories/usersRepository';
import { NotFoundError, ForbiddenError, UnauthorizedError } from '../errors/AppError';
import type { RequestHandler } from "express";

export const checkAvatarAccess: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return next(new UnauthorizedError("Not authenticated"));

        const currentUser = await findUserById(Number(req.params.id));
        if (!currentUser) return next(new NotFoundError('User not found'));
        
        const isSelf = currentUser.id === req.user.id;
        const isModerator = req.user.role === 'moderator';
        if (!isSelf && !isModerator) return next(new ForbiddenError('Not enough rights to modify avatar of this user'));
        
        req.currentUser = currentUser;
        next();
    } catch (err) {
        next(err);
    }
};