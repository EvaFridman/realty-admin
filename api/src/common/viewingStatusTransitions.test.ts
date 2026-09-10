import { canTransition } from "./viewingStatusTransitions.service.js";

describe("viewingStatusTransitions", () => {
    const validTransitions = [
        ["created", "pending_approval"],
        ["pending_approval", "approved"],
        ["pending_approval", "rejected"],
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
        ["pending_approval", "created"],
        ["pending_approval", "pending_approval"],
        ["pending_approval", "closed"],
        ["approved", "pending_approval"],
        ["approved", "rejected"],
        ["rejected", "approved"],
        ["rejected", "pending_approval"],
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