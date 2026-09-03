import { canTransition, getAllowedTransitions } from "../../src/utils/listingStatusTransitions";

describe("listingStatusTransitions", () => {
    const validTransitions = [
        ["draft", "moderation"],
        ["moderation", "published"],
        ["moderation", "rejected"],
        ["rejected", "moderation"],
        ["published", "unpublished"],
        ["unpublished", "moderation"],
    ] as const;

    test.each(validTransitions)(
        "from %s to %s should be allowed",
        (from, to) => {
            expect(canTransition(from, to)).toBe(true);
        }
    );

    const invalidTransitions = [
        ["draft", "rejected"],
        ["draft", "published"],
        ["published", "draft"],
        ["moderation", "moderation"],
        ["rejected", "draft"],
        ["rejected", "published"],
        ["unpublished", "published"],
        ["unpublished", "draft"],
    ] as const;

    test.each(invalidTransitions)(
        "from %s to %s should be disallowed",
        (from, to) => {
            expect(canTransition(from, to)).toBe(false);
        }
    );
});

describe("getAllowedTransitions", () => {
    const expectedAllowedTransitions = [
        ["draft", ["moderation"]],
        ["moderation", ["published", "rejected"]],
        ["rejected", ["moderation"]],
        ["published", ["unpublished"]],
        ["unpublished", ["moderation"]],
    ] as const;

    test.each(expectedAllowedTransitions)(
        'should return correct allowed transitions for status "%s"',
        (status, expectedAllowed) => {
            expect(getAllowedTransitions(status)).toEqual(expectedAllowed);
        }
    );
});