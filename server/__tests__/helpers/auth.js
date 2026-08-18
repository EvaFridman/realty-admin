const jwt = require('jsonwebtoken');

process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret-for-jest-only';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-for-jest-only';
process.env.ACCESS_TTL = process.env.ACCESS_TTL || '15m';
process.env.REFRESH_TTL = process.env.REFRESH_TTL || '30d';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'silent';
process.env.MAIL_TRANSPORT = 'stream';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function signTestAccessToken(user) {
    return jwt.sign(
        { sub: user.id, role: user.role },
        ACCESS_SECRET,
        { expiresIn: '15m' }
    );
}

function signTestRefreshToken(user) {
    return jwt.sign(
        { sub: user.id },
        REFRESH_SECRET,
        { expiresIn: '30d' }
    );
}

function authHeader(user) {
    return { Authorization: `Bearer ${signTestAccessToken(user)}` };
}

module.exports = {
    signTestAccessToken,
    signTestRefreshToken,
    authHeader,
    ACCESS_SECRET,
    REFRESH_SECRET,
};