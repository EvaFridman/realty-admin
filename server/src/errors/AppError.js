class AppError extends Error {
    constructor(message, status = 500, details = null, code = null) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.details = details;
        this.code = code;
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not found', details = null, code = null) {
        super(message, 404, details, code);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict', details = null, code = null) {
        super(message, 409, details, code);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation failed', details = null, code = null) {
        super(message, 422, details, code);
    }
}

class ExternalServiceError extends AppError {
    constructor(message = 'External service error', details = null, code = null) {
        super(message, 502, details, code);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', details = null, code = null) {
        super(message, 401, details, code);
    }
}

class UnprocessableEntityError extends AppError {
    constructor(message = 'UnprocessableEntity', details = null, code = null) {
        super(message, 422, details, code);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', details = null, code = null) {
        super(message, 403, details, code);
    }
}

module.exports = { AppError, NotFoundError, ConflictError, ValidationError, ExternalServiceError, UnauthorizedError, UnprocessableEntityError, ForbiddenError };
