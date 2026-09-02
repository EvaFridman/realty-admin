import type { AuthUser } from "../../types/index";
import type { Listing, ListingStatus } from "../../database/models/listing";
import type { CreateListingBody, UpdateListingBody, ListingsListQuery } from "../schemas/listingsSchema";
import * as listingsRepo from "../repositories/listingsRepository";
import * as listingsPhotoRepo from "../repositories/listingPhotosRepository";
import { parseListingFilters } from "../utils/parseListingFilters";
import { canTransition, getAllowedTransitions } from "../utils/listingStatusTransitions";
import { NotFoundError, ConflictError, ForbiddenError } from "../errors/AppError";
import { APP_CONFIG } from "../config";
import type { Logger } from "pino";
import { logger } from "../tools/logger";
import { deletePhysicalFile } from "./imagesService";

export type ListMeta = { page: number; limit: number; total: number; totalPages: number };
export type ListingDto = ReturnType<Listing["toJSON"]> & { allowedTransitions: ListingStatus[] };

export async function listListings(user: AuthUser, rawQuery: ListingsListQuery): Promise<{ data: Listing[]; meta: ListMeta }> {
    const filters = parseListingFilters(rawQuery);
    if (user.role !== 'moderator') filters.agentId = user.id;
    filters.limit = Math.min(filters.limit, APP_CONFIG.pagination.maxSize);

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

export async function getListingById(user: AuthUser, id: number): Promise<ListingDto> {
    const listing = await listingsRepo.findListingById(id);
    if (!listing) throw new NotFoundError('Listing not found');

    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to access this listing');

    return { ...listing.toJSON(), allowedTransitions: getAllowedTransitions(listing.status) };
}

export async function getListingForPdf(user: AuthUser, id: number): Promise<Listing> {
    const listing = await listingsRepo.findListingById(id);

    if (!listing) throw new NotFoundError('Listing not found');

    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';

    if (!isOwner && !isModerator) {
        throw new ForbiddenError('Not enough rights to access this listing');
    }

    return listing;
}

export async function getListingsByIds(ids: number[]): Promise<Listing[]> {
    return listingsRepo.findListingsByIds(ids);
}

export async function createListing(user: AuthUser, data: CreateListingBody): Promise<Listing> {
    const listingData = { ...data, agentId: user.id };
    const listing = await listingsRepo.createListing(listingData);
    return listing;
}

export async function updateListing(user: AuthUser, id: number, data: UpdateListingBody): Promise<Listing> {
    const listing = await listingsRepo.findListingById(id);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to update this listing');
    const updatedListing = await listingsRepo.updateListing(id, data);
    if (!updatedListing) throw new NotFoundError('Listing not found');
    return updatedListing;
}

export async function deleteListing(user: AuthUser, id: number, log: Logger = logger): Promise<void> {
    const listing = await listingsRepo.findListingById(id);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to delete this listing');
    const photos = await listingsPhotoRepo.findPhotosByListingId(id);
    await listingsRepo.deleteListing(id);
    for (const photo of photos) {
        if (photo.fileName) await deletePhysicalFile(photo.fileName, 'photos', log);
    }
}

export function checkPublishRequirements(listing: Listing): string[] {
    const missing = [];
    const photos = listing.photos || [];

    if (!photos.length) missing.push('At least one photo is required');
    if (!photos.some((p) => p.isCover)) missing.push('A cover photo is required');
    if (!(Number(listing.price) > 0)) missing.push('Price must be greater than zero');
    if (!listing.districtId) missing.push('District is required');
    if (listing.lat == null || listing.lng == null) missing.push('Coordinates are required');

    return missing;
}

export async function changeStatus(id: number, newStatus: ListingStatus, rejectionReason: string | undefined, log: Logger = logger): Promise<Listing> {
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
    const updatedListing = await listingsRepo.updateListingStatus(id, newStatus, newStatus === 'rejected' ? rejectionReason : null);
    if (!updatedListing) throw new NotFoundError('Listing not found');
    return updatedListing;
}