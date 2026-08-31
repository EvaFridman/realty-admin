import type { AuthUser } from "./domain/user";
import type { Listing } from "./domain/listing";

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
            userId?: number;
            validatedQuery?: unknown;
            listing?: Listing;
        }
    }
}

export { };