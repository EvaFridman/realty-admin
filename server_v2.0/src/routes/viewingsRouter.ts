import { Router } from "express";
import * as viewingsController from "../controllers/viewingsController";
import { validate } from "../middleware/validate";
import { verifyAccessToken } from "../middleware/auth";
import { pathIdSchema } from "../schemas/pathSchema";
import { createViewingSchema } from "../schemas/viewingsSchema";
import { viewingLimiter } from "../middleware/rateLimiters";

const viewingsRouter = Router({ mergeParams: true });

viewingsRouter.get('/', verifyAccessToken, validate(pathIdSchema, 'params'), viewingsController.list);
viewingsRouter.post('/', viewingLimiter, validate(pathIdSchema, 'params'), validate(createViewingSchema, 'body'), viewingsController.create);

export default viewingsRouter;