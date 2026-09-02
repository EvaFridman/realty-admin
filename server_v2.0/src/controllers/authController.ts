import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import * as usersService from "../services/usersService";
import * as usersRepo from "../repositories/usersRepository";
import { sendResponse } from "../utils/response";
import type { Login, Register, ChangePassword } from "../schemas/authSchema";
import { NotFoundError, ConflictError, UnauthorizedError, UnprocessableEntityError } from "../errors/AppError";
import { issuePair } from "../services/tokensService";

const DEFAULT_ROLE = 'agent';

export const register: RequestHandler<Record<string, never>, unknown, Register> = async (req, res) => {
    const { email, password, name } = req.body;

    const userExists = await usersRepo.findUserWithEmail(email);
    if (userExists) throw new ConflictError('User with such an email already exists');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await usersRepo.createUser({ email, passwordHash, role: DEFAULT_ROLE, name })

    sendResponse(res, 201, issuePair(res, user), null, null);
}

export const login: RequestHandler<Record<string, never>, unknown, Login> = async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.findByEmailWithPassword(email);
    if (!user) throw new UnprocessableEntityError('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new UnprocessableEntityError('Invalid email or password');

    sendResponse(res, 200, issuePair(res, user), null, null);
}

export const refresh: RequestHandler = async (req, res) => {
    const user = await usersRepo.findById(Number(req.userId));
    if (!user) {
        res.clearCookie('refreshToken', { path: '/auth' });
        throw new UnauthorizedError('User no longer exists');
    }

    sendResponse(res, 200, issuePair(res, user), null, null);
}

export const logout: RequestHandler = async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/auth',
    });
    res.status(204).send();
}

export const me: RequestHandler = async (req, res) => {
    const user = await usersRepo.findUserById(req.user!.id);
    if (!user) throw new NotFoundError('User not found');
    sendResponse(res, 200, user, null, null);
}

export const updatePassword: RequestHandler<Record<string, never>, unknown, ChangePassword> = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await usersRepo.findUserById(req.user!.id);
    if (!user) throw new NotFoundError('User not found');
    const result = await usersService.changeUserPassword(user.email, { currentPassword, newPassword });
    sendResponse(res, 200, result, null, null);
}