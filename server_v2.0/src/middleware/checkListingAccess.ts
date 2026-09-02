import { findListingById } from '../repositories/listingsRepository';
import { NotFoundError, ForbiddenError, UnauthorizedError } from '../errors/AppError';
import type { RequestHandler } from "express";

export const checkListingAccess: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) return next(new UnauthorizedError("Not authenticated"));
        const listing = req.listing ?? await findListingById(Number(req.params.id));
        if (!listing) return next(new NotFoundError('Listing not found'));
        
        const isOwner = listing.agentId === req.user.id;
        const isModerator = req.user.role === 'moderator';
        
        if (!isOwner && !isModerator) {
            return next(new ForbiddenError('Not enough rights to modify photos of this listing'));
        }
        
        req.listing = listing;
        next();
    } catch (err) {
        next(err);
    }
};