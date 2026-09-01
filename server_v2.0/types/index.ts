import type { Request } from 'express';
import type { UserRole } from "../database/models/user.js";
import type { Listing } from "../database/models/listing.js";

export type AuthUser = {
    id: number;
    role: UserRole;
};

export type HTTPErrorType = {
  message: string;
  details?: unknown;
  code?: string | null;
};

export type HTTPResponseType<TData = unknown, TMeta = unknown> = {
  data: TData | null;
  error: HTTPErrorType | null;
  meta: TMeta | null;
};

export type HTTPRequestType<
  TParams = Record<string, string>,
  TBody = unknown,
  TQuery = unknown
> = Request<TParams, unknown, TBody, TQuery>;

export type HTTPAuthedRequestType = Request & { user: AuthUser };

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