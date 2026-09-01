import type { ListingStatus } from '../../database/models/listing'

const ALL_STATUSES = ['draft', 'moderation', 'published', 'rejected', 'unpublished'] as const satisfies readonly ListingStatus[];

const ALLOWED_TRANSITIONS: Record<ListingStatus, ListingStatus | readonly ListingStatus[]> = {
    draft: 'moderation',
    moderation: ['published', 'rejected'],
    rejected: 'moderation',
    published: 'unpublished',
    unpublished: 'moderation',
};

export function canTransition(from: ListingStatus, to: ListingStatus): boolean {
    return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getAllowedTransitions(currentStatus: ListingStatus): ListingStatus[] {
    return ALL_STATUSES.filter((status) => status !== currentStatus && canTransition(currentStatus, status));
}