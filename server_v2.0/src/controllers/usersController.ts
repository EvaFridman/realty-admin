import type { RequestHandler } from "express";
import type { User } from "../../database/models/user";
import * as usersService from "../services/usersService";
import { sendResponse } from "../utils/response";
import { buildImageUrl } from "../services/imagesService";
import type { CreateUserBody, UpdateUserBody } from "../schemas/usersSchema";

export function toUserDto(user: User) {
    const rawUserData = user.get({ plain: true });
    const { passwordHash, avatarFileName, ...userData } = rawUserData;

    return {
        ...userData,
        avatarUrl: avatarFileName && buildImageUrl('avatars', avatarFileName)
    };
};

export const list: RequestHandler = async (req, res) => {
    const { users, meta } = await usersService.listUsers(req.query);
    sendResponse(res, 200, users.map(toUserDto), null, meta);
}

export const getById: RequestHandler<{ id: string }> = async (req, res) => {
    const user = await usersService.getUserById(Number(req.params.id));
    sendResponse(res, 200, toUserDto(user), null, null);
}

export const create: RequestHandler<Record<string, never>, unknown, CreateUserBody> = async (req, res) => {
    const user = await usersService.createUser(req.body);
    sendResponse(res, 201, toUserDto(user), null, null);
}

export const update: RequestHandler<{ id: string }, unknown, UpdateUserBody> = async (req, res) => {
    const user = await usersService.updateUser(Number(req.params.id), req.body);
    sendResponse(res, 200, toUserDto(user), null, null);
}