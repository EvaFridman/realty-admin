import type { Request } from 'express';

export type HTTPRequestType<
  TParams = Record<string, string>,
  TBody = unknown,
  TQuery = unknown
> = Request<TParams, unknown, TBody, TQuery>;