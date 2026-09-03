import { canTransition } from "../../src/utils/viewingStatusTransitions";

describe("viewingStatusTransitions", () => {
    const validTransitions = [
        ["created", "pending approval"],
        ["pending approval", "approved"],
        ["pending approval", "rejected"],
        ["approved", "closed"],
        ["rejected", "closed"],
    ] as const;

    test.each(validTransitions)(
        "from %s to %s should be allowed",
        (from, to) => {
            expect(canTransition(from, to)).toBe(true);
        }
    );

    const invalidTransitions = [
        ["created", "approved"],
        ["created", "rejected"],
        ["created", "closed"],
        ["pending approval", "created"],
        ["pending approval", "pending approval"],
        ["pending approval", "closed"],
        ["approved", "pending approval"],
        ["approved", "rejected"],
        ["rejected", "approved"],
        ["rejected", "pending approval"],
        ["closed", "created"],
        ["closed", "approved"],
    ] as const;

    test.each(invalidTransitions)(
        "from %s to %s should be disallowed",
        (from, to) => {
            expect(canTransition(from, to)).toBe(false);
        }
    );
});