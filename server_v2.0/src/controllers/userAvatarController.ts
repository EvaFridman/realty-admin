import type { RequestHandler } from "express";
import * as usersRepo from "../repositories/usersRepository";
import { deletePhysicalFile } from "../services/imagesService";
import { sendResponse } from "../utils/response";
import { ValidationError, NotFoundError } from "../errors/AppError";
import { toUserDto } from "./usersController";

export const create: RequestHandler<{ id: string }> = async (req, res) => {
    if (!req.file) throw new ValidationError('File is required');
    const user = req.currentUser!;
    const oldFileName = user.avatarFileName;
    const updatedUser = await usersRepo.updateUser(user.id, { avatarFileName: req.file.filename });
    if (!updatedUser) throw new NotFoundError("User not found");
    if (oldFileName) await deletePhysicalFile(oldFileName, 'avatars', req.log);
    sendResponse(res, 200, toUserDto(updatedUser), null, null);
}

export const remove: RequestHandler<{ id: string }> = async (req, res) => {
    const user = req.currentUser!;
    const oldFileName = user.avatarFileName;
    if (!oldFileName) return sendResponse(res, 200, toUserDto(user), null, null);
    const updatedUser = await usersRepo.updateUser(user.id, { avatarFileName: null });
    if (!updatedUser) throw new NotFoundError("User not found");
    await deletePhysicalFile(oldFileName, 'avatars', req.log);
    res.status(204).send();
}