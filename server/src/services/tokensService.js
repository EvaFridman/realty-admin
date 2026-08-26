const ms = require('ms');
const jwt = require('jsonwebtoken');
const config = require('../config');
const imagesService = require('./imagesService');

function signAccessToken(user) {
    return jwt.sign({ sub: user.id, role: user.role },
        config.jwt.accessSecret, { expiresIn: config.jwt.accessTtl });
}

function signRefreshToken(user) {
    return jwt.sign({ sub: user.id },
        config.jwt.refreshSecret, { expiresIn: config.jwt.refreshTtl });
}

function setRefreshCookie(res, token) {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        path: '/auth',
        maxAge: ms(config.jwt.refreshTtl),
    });
}

function issuePair(res, user) {
    setRefreshCookie(res, signRefreshToken(user));
    return { accessToken: signAccessToken(user),
        user: { id: user.id, email: user.email, role: user.role, avatarUrl: user.avatarFileName ? imagesService.buildImageUrl('avatars', user.avatarFileName) : null }};
}

module.exports = { signAccessToken, signRefreshToken, setRefreshCookie, issuePair };