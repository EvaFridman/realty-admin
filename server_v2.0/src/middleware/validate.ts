import type { RequestHandler } from "express";
import { z, type ZodType } from "zod";
import { ValidationError } from "../errors/AppError";

type Source = "body" | "query" | "params";

export function validate<T>(schema: ZodType<T>, source: Source = 'body'): RequestHandler {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const { fieldErrors } = z.flattenError(result.error);
            const details = Object.values(fieldErrors).filter((errors): errors is string[] => Array.isArray(errors)).flat();
            return next(new ValidationError("Validation failed", details));
        }
        if (source === 'query') {
            req.validatedQuery = result.data;
        } else {
            req[source] = result.data as never;
        }
        next();
    };
}