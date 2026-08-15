const { ValidationError } = require('../errors/AppError');

function validate(schema, source = 'body') {
    return (req, res, next) => {
        const data = req[source];
        const result = schema.safeParse(data);
        if(!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            const details = Object.values(fieldErrors).flat();
            const error = new ValidationError("Validation failed", details);
            return next(error);
        }
        if (source === 'query') {
            req.validatedQuery = result.data;
        } else {
            req[source] = result.data;
        }
        next();
    };
}

module.exports = { validate };