import type { AuthUser } from "../../types/index";
import * as viewingsRepo from "../repositories/viewingsRepository";
import * as listingsRepo from "../repositories/listingsRepository";
import type { Viewing, ViewingStatus } from "../../database/models/viewing";
import { sendNewViewingNotice, sendViewingConfirmation } from "./mailService";
import { canTransition, getAllowedTransitions } from "../utils/viewingStatusTransitions";
import { NotFoundError, ConflictError, ForbiddenError } from "../errors/AppError";
import type { CreateViewingBody, ViewingsListQuery } from "../schemas/viewingsSchema";
import type { Logger } from "pino";
import { logger } from "../tools/logger";

export type ViewingDto = ReturnType<Viewing["toJSON"]> & { allowedTransitions: ViewingStatus[] };

export async function listViewings(user: AuthUser, listingId: number): Promise<ViewingDto[]> {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');
    const isOwner = listing.agentId === user.id;
    const isModerator = user.role === 'moderator';
    if (!isOwner && !isModerator) throw new ForbiddenError('Not enough rights to access this listing');
    const viewings = await viewingsRepo.findViewingsByListingId(listingId);
    return viewings.map((viewing) => ({ ...viewing.toJSON(), allowedTransitions: getAllowedTransitions(viewing.status) }));
}

export async function listAllViewings(filters: ViewingsListQuery): Promise<{data: ViewingDto[]; meta: { page: number; limit: number; total: number; totalPages: number } }> {
    const { rows, count } = await viewingsRepo.findAndCountViewings(filters);
    const data = rows.map((row) => ({ ...row.toJSON(), allowedTransitions: getAllowedTransitions(row.status) }));
    return {
        data,
        meta: {
            page: filters.page,
            limit: filters.limit,
            total: count,
            totalPages: Math.ceil(count / filters.limit),
        },
    };
}

export async function createViewing(listingId: number, data: CreateViewingBody, log: Logger = logger): Promise<Viewing> {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');

    if (listing.status !== 'published') {
        throw new ConflictError('Can only request a viewing on a published listing');
    }

    const viewing = await viewingsRepo.createViewing(listingId, data);

    try {
        await sendNewViewingNotice(listing, viewing);
        await viewingsRepo.markNotified(viewing.id);
        log.info({ viewingId: viewing.id }, 'Agent notified about new viewing request');
    } catch (err) {
        log.error({ err, viewingId: viewing.id }, 'Failed to notify agent about new viewing');
    }

    return viewing;
}

export async function changeStatus(id: number, newStatus: ViewingStatus, log: Logger = logger): Promise<ViewingDto> {
    const viewing = await viewingsRepo.findViewingById(id);
    if (!viewing) throw new NotFoundError('Viewing not found');

    if (!canTransition(viewing.status, newStatus)) {
        log.warn(
            { viewingId: id, from: viewing.status, to: newStatus },
            'Rejected viewing status transition'
        );
        throw new ConflictError(`Cannot change status from "${viewing.status}" to "${newStatus}"`);
    }

    const updated = await viewingsRepo.updateViewingStatus(id, { status: newStatus });
    if (!updated) throw new NotFoundError("Viewing not found");
    if (newStatus === 'approved') {
        if (!viewing.listing) throw new NotFoundError("Listing not found");
        try {
            await sendViewingConfirmation(viewing.listing, updated);
            log.info({ viewingId: id }, 'Client notified about viewing confirmation');
        } catch (err) {
            log.error({ err, viewingId: id }, 'Failed to notify client about confirmation');
        }
    }

    return { ...updated.toJSON(), allowedTransitions: getAllowedTransitions(updated.status) };

}