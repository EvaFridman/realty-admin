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

module.exports = { canTransition, ALLOWED_TRANSITIONS };