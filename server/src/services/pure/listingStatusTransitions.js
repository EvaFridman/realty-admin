const ALLOWED_TRANSITIONS = {
    draft: ['moderation'],
    moderation: ['published', 'rejected'],
    rejected: ['moderation'],
    published: ['unpublished'],
    unpublished: ['moderation'],
};

function canTransition(from, to) {
    return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

const ALL_STATUSES = ['draft', 'moderation', 'published', 'rejected', 'unpublished'];

function getAllowedTransitions(currentStatus) {
    return ALL_STATUSES.filter(
        (status) => status !== currentStatus && canTransition(currentStatus, status)
    );
}

module.exports = { canTransition, ALLOWED_TRANSITIONS, getAllowedTransitions, ALL_STATUSES };