import type { AuthUser } from ".";
import type { Listing } from "../database/models/listing";

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