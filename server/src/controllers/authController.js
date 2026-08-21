const bcrypt = require('bcryptjs');
const usersRepo = require('../repositories/usersRepository');
const { NotFoundError, ConflictError, UnauthorizedError, UnprocessableEntityError } = require('../errors/AppError');
const sendResponse = require('../utils/response');
const { issuePair } = require('../services/tokensService');
const usersService = require('../services/usersService');

const DEFAULT_ROLE = 'agent';

async function register(req, res, next) {
    try {
        const { email, password } = req.body;

        const userExists = await usersRepo.findUserWithEmail(email);
        if (userExists) throw new ConflictError('User with such an email already exists');

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await usersRepo.createUser({email, passwordHash, DEFAULT_ROLE, name: email.split('@')[0]})

        sendResponse(res, 201, issuePair(res, user), null, null);
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await usersRepo.findByEmailWithPassword(email);
        if (!user) throw new UnprocessableEntityError('Invalid email or password');

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) throw new UnprocessableEntityError('Invalid email or password');

        sendResponse(res, 200, issuePair(res, user), null, null);
    } catch (err) {
        next(err);
    }
}

async function refresh(req, res, next) {
    try {
        const user = await usersRepo.findById(req.userId);
        if (!user) {
            res.clearCookie('refreshToken', { path: '/auth' });
            throw new UnauthorizedError('User no longer exists');
        }

        sendResponse(res, 200, issuePair(res, user), null, null);
    } catch (err) {
        next(err);
    }
}

async function logout(req, res, next) {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/auth',
        });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

async function me(req, res, next) {
    try {
        const user = await usersRepo.findUserById(req.user.id);
        if (!user) throw new NotFoundError('User not found');
        sendResponse(res, 200, user, null, null);
    } catch (err) {
        next(err);
    }
}

async function updatePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await usersService.changeUserPassword(req.user.email, currentPassword, newPassword);
        sendResponse(res, 200, result, null, null);
    } catch (err) {
        next(err);
    }
}
module.exports = { register, login, refresh, logout, me, updatePassword };