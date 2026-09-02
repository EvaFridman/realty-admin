import { Router } from "express";
import * as viewingsController from "../controllers/viewingsController";
import { validate } from "../middleware/validate";
import { verifyAccessToken, requireRole } from "../middleware/auth";
import { pathIdSchema } from "../schemas/pathSchema";
import { changeViewingStatusSchema, viewingsListQuerySchema } from "../schemas/viewingsSchema";

const viewingsStatusRouter = Router();

viewingsStatusRouter.use(verifyAccessToken);
viewingsStatusRouter.use(requireRole('moderator'));

viewingsStatusRouter.get('/', validate(viewingsListQuerySchema, 'query'), viewingsController.listAll);
viewingsStatusRouter.patch('/:id/status', validate(pathIdSchema, 'params'), validate(changeViewingStatusSchema, 'body'), viewingsController.changeStatus);

export default viewingsStatusRouter;