const listingsRepo = require('../repositories/listingsRepository');
const { NotFoundError, ForbiddenError } = require('../errors/AppError');

const checkListingAccess = async (req, res, next) => {
    try {
        const listing = req.listing ?? await listingsRepo.findListingById(req.params.id);
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

module.exports = checkListingAccess;