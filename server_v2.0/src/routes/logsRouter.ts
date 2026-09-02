import { Router } from "express";
import * as logsController from "../controllers/logsController";
import { validate } from "../middleware/validate";
import { verifyAccessToken, requireRole } from "../middleware/auth";
import { logsQuerySchema } from "../schemas/logsSchema";

const logsRouter = Router();

logsRouter.get('/', verifyAccessToken, requireRole('moderator'), validate(logsQuerySchema, 'query'), logsController.list);

export default logsRouter;