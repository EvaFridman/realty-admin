import { Router } from "express";
import * as favoritesController from "../controllers/favoritesController";
import { validate } from "../middleware/validate";
import { verifyAccessToken } from "../middleware/auth";
import { pathIdSchema, userFavoriteParamsSchema } from "../schemas/pathSchema";
import { createFavoriteSchema, updateFavoriteSchema } from "../schemas/favoritesSchema";

const favoritesRouter = Router({ mergeParams: true });

favoritesRouter.use(verifyAccessToken);

favoritesRouter.get('/', validate(pathIdSchema, 'params'), favoritesController.list);
favoritesRouter.post('/', validate(pathIdSchema, 'params'), validate(createFavoriteSchema, 'body'), favoritesController.create);
favoritesRouter.put('/:listingId', validate(userFavoriteParamsSchema, 'params'), validate(updateFavoriteSchema, 'body'), favoritesController.update);
favoritesRouter.delete('/:listingId', validate(userFavoriteParamsSchema, 'params'), favoritesController.remove);

export default favoritesRouter;