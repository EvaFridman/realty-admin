const { canTransition } = require('../../src/services/pure/listingStatusTransitions');

describe('listingStatusTransitions', () => {
    const validTransitions = [
        ['draft', 'moderation'],
        ['moderation', 'published'],
        ['moderation', 'rejected'],
        ['rejected', 'moderation'],
        ['published', 'unpublished'],
        ['unpublished', 'moderation'],
    ];

    test.each(validTransitions)('from %s to %s should be allowed', (from, to) => {
        expect(canTransition(from, to)).toBe(true);
    });

    const invalidTransitions = [
        ['draft', 'rejected'],
        ['draft', 'published'],
        ['published', 'draft'],
        ['moderation', 'moderation'],
        ['rejected', 'draft'],
        ['rejected', 'published'],
        ['unpublished', 'published'],
        ['unpublished', 'draft'],
    ];

    test.each(invalidTransitions)('from %s to %s should be disallowed', (from, to) => {
        expect(canTransition(from, to)).toBe(false);
    });
});