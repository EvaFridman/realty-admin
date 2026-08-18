const jwt = require('jsonwebtoken');
const config = require('../config');
const { UnauthorizedError, ForbiddenError } = require('../errors/AppError');

function verifyAccessToken(req, res, next) {
    const header = req.headers.authorization ?? "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) return next(new UnauthorizedError("No access token"));

    try {
        const payload = jwt.verify(token, config.jwt.accessSecret);
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid access token';
        next(new UnauthorizedError(message, null, error.name));
    }
}

function verifyRefreshToken(req, res, next) {
    const token = req.cookies?.refreshToken;

    if (!token) return next(new UnauthorizedError("No refresh token"));

    try {
        const payload = jwt.verify(token, config.jwt.refreshSecret);
        req.userId = payload.sub;
        next();
    } catch (error) {
        res.clearCookie("refreshToken", { path: "/auth" });
        next(new UnauthorizedError('Invalid refresh token', null, error.name));
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) return next(new UnauthorizedError('Not authenticated'));
        if (!roles.includes(req.user.role)) return next(new ForbiddenError(`Required roles: ${roles.join(', ')}`));
        next();
    };
}

module.exports = { verifyAccessToken, verifyRefreshToken, requireRole };