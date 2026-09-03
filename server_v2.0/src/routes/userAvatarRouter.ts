import { Router } from "express";
import * as userAvatarController from "../controllers/userAvatarController";
import { verifyAccessToken } from "../middleware/auth";
import { createImageUpload } from "../middleware/upload";
import { checkAvatarAccess } from "../middleware/checkAvatarAccess";
import { validate } from "../middleware/validate";
import { pathIdSchema } from "../schemas/pathSchema";
import { uploadLimiter } from "../middleware/rateLimiters";

const userAvatarRouter = Router();

userAvatarRouter.post('/:id/avatar', uploadLimiter, verifyAccessToken, validate(pathIdSchema, 'params'), checkAvatarAccess,
(req, res, next) => {
    createImageUpload({
        folder: "avatars",
        maxFileSizeMb: 5,
        maxFiles: 1,
    }).single("avatar")(req, res, (err) => {
        if (err) return next(err);
        next();
    });
},
userAvatarController.create);

userAvatarRouter.delete('/:id/avatar', verifyAccessToken, checkAvatarAccess, userAvatarController.remove);

export default userAvatarRouter;