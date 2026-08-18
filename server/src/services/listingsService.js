const listingsRepo = require('../repositories/listingsRepository');
const parseListingFilters = require('./pure/parseListingFilters');
const { canTransition, getAllowedTransitions } = require('./pure/listingStatusTransitions');
const { NotFoundError, ConflictError, ForbiddenError } = require('../errors/AppError');
const config = require('../config');
const defaultLogger = require('../../logger');

async function listListings(user, rawQuery) {
    const filters = parseListingFilters(rawQuery);
    if (user.role !== 'moderator') filters.agentId = user.id;
    filters.limit = Math.min(filters.limit, config.pagination.maxSize);

    const { rows, count } = await listingsRepo.findAndCountListings(filters);
    return {
        data: rows,
        meta: {
            page: filters.page,
            limit: filters.limit,
            total: count,
            totalPages: Math.ceil(count / filters.limit),
        },
    };
}

async function getListingById(user, id) {
    const listing = await listingsRepo.findListingById(id);
    if (!listing) throw new NotFoundError('Listing not found');

    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to access this listing');

    const plainListing = listing.toJSON();
    plainListing.allowedTransitions = getAllowedTransitions(listing.status);
    return plainListing;
}

async function getListingsByIds(ids) {
    return listingsRepo.findListingsByIds(ids);
}

async function createListing(user, data) {
    const listingData = { ...data, agentId: user.id };
    const listing = await listingsRepo.createListing(listingData);
    return listing;
}

async function updateListing(user, id, data) {
    const listing = await listingsRepo.findListingById(id);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to update this listing');
    return listingsRepo.updateListing(id, data);
}

async function deleteListing(user, id) {
    const listing = await listingsRepo.findListingById(id);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to delete this listing');
    await listingsRepo.deleteListing(id);
}

function checkPublishRequirements(listing) {
    const missing = [];
    const photos = listing.photos || [];

    if (!photos.length) missing.push('At least one photo is required');
    if (!photos.some((p) => p.isCover)) missing.push('A cover photo is required');
    if (!(Number(listing.price) > 0)) missing.push('Price must be greater than zero');
    if (!listing.districtId) missing.push('District is required');
    if (listing.lat == null || listing.lng == null) missing.push('Coordinates are required');

    return missing;
}

async function changeStatus(id, newStatus, rejectionReason, log = defaultLogger) {
    const listing = await listingsRepo.findListingById(id);
    if (!listing) throw new NotFoundError('Listing not found');

    if (!canTransition(listing.status, newStatus)) {
        log.warn(
            { listingId: id, from: listing.status, to: newStatus },
            'Rejected listing status transition'
        );
        throw new ConflictError(`Cannot change status from "${listing.status}" to "${newStatus}"`);
    }

    if (newStatus === 'rejected' && !rejectionReason) {
        throw new ConflictError('Rejection reason is required');
    }

    if (newStatus === 'published') {
        const missing = checkPublishRequirements(listing);
        if (missing.length) {
            log.warn({ listingId: id, missing }, 'Rejected publishing: requirements not met');
            throw new ConflictError('Cannot publish listing', missing);
        }
    }

    log.info({ listingId: id, from: listing.status, to: newStatus }, 'Listing status changed');
    return listingsRepo.updateListingStatus(id, newStatus, newStatus === 'rejected' ? rejectionReason : null);
}

module.exports = { listListings, getListingById, getListingsByIds, createListing, updateListing, deleteListing, changeStatus, checkPublishRequirements };