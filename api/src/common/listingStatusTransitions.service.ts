import { ListingStatus } from '../generated/prisma/index.js';

const ALL_STATUSES = Object.values(ListingStatus);

const ALLOWED_TRANSITIONS: Record<ListingStatus, readonly ListingStatus[]> = {
    [ListingStatus.draft]: [ListingStatus.moderation],
    [ListingStatus.moderation]: [ListingStatus.published, ListingStatus.rejected],
    [ListingStatus.rejected]: [ListingStatus.moderation],
    [ListingStatus.published]: [ListingStatus.unpublished],
    [ListingStatus.unpublished]: [ListingStatus.moderation],
};

export function canTransition(from: ListingStatus, to: ListingStatus): boolean {
    const transitions = ALLOWED_TRANSITIONS[from];
    if (!transitions) return false;
    return transitions.includes(to);
}

export function getAllowedTransitions(currentStatus: ListingStatus): ListingStatus[] {
    return ALL_STATUSES.filter((status) => status !== currentStatus && canTransition(currentStatus, status));
}