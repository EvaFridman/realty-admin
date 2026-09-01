export class AppError extends Error {
    readonly status: number;
    readonly details: string[] | null;
    readonly code: string | null;

    constructor(
        message: string,
        status: number = 500,
        details: string[] | null = null,
        code: string | null = null
    ) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.details = details;
        this.code = code;
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not found', details: string[] | null = null, code: string | null = null) {
        super(message, 404, details, code);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict', details: string[] | null = null, code: string | null = null) {
        super(message, 409, details, code);
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation failed', details: string[] | null = null, code: string | null = null) {
        super(message, 422, details, code);
    }
}

export class ExternalServiceError extends AppError {
    constructor(message = 'External service error', details: string[] | null = null, code: string | null = null) {
        super(message, 502, details, code);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', details: string[] | null = null, code: string | null = null) {
        super(message, 401, details, code);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message = 'UnprocessableEntity', details: string[] | null = null, code: string | null = null) {
        super(message, 422, details, code);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', details: string[] | null = null, code: string | null = null) {
        super(message, 403, details, code);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message = 'Too many requests', details: string[] | null = null, code: string | null = null) {
        super(message, 429, details, code);
    }
}