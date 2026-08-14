class AppError extends Error {
    constructor(message, status = 500, details = null) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.details = details;
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not found', details = null) {
        super(message, 404, details);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict', details = null) {
        super(message, 409, details);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation failed', details = null) {
        super(message, 422, details);
    }
}

class ExternalServiceError extends AppError {
    constructor(message = 'External service error', details = null) {
        super(message, 502, details);
    }
}

module.exports = { AppError, NotFoundError, ConflictError, ValidationError, ExternalServiceError };
