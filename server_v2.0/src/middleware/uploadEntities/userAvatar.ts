import { createImageUpload } from '../upload';
import type { RequestHandler } from "express";

export const avatarUpload: RequestHandler = createImageUpload({ folder: "avatars", maxFileSizeMb: 3, maxFiles: 1 }).single('avatar');