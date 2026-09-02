import { Router } from "express";
import * as usersController from "../controllers/usersController";
import { validate } from "../middleware/validate";
import { verifyAccessToken, requireRole } from "../middleware/auth";
import { pathIdSchema } from "../schemas/pathSchema";
import { createUserSchema, updateUserSchema } from "../schemas/usersSchema";

const usersRouter = Router();

usersRouter.use(verifyAccessToken);
usersRouter.use(requireRole('moderator'));

usersRouter.get('/', usersController.list);
usersRouter.get('/:id', validate(pathIdSchema, 'params'), usersController.getById);
usersRouter.post('/', validate(createUserSchema, 'body'), usersController.create);
usersRouter.put('/:id', validate(pathIdSchema, 'params'), validate(updateUserSchema, 'body'), usersController.update);

export default usersRouter;