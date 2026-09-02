import { Router } from "express";
import * as listingsController from "../controllers/listingsController";
import { validate } from "../middleware/validate";
import { verifyAccessToken, requireRole } from "../middleware/auth";
import { pathIdSchema } from "../schemas/pathSchema";
import { createListingSchema, updateListingSchema, changeListingStatusSchema, listingsListQuerySchema } from "../schemas/listingsSchema";

const listingsRouter = Router();

listingsRouter.use(verifyAccessToken);

listingsRouter.get('/', validate(listingsListQuerySchema, 'query'), listingsController.list);
listingsRouter.get('/:id', validate(pathIdSchema, 'params'), listingsController.getById);
listingsRouter.post('/', validate(createListingSchema, 'body'), listingsController.create);
listingsRouter.put('/:id', validate(pathIdSchema, 'params'), validate(updateListingSchema, 'body'), listingsController.update);
listingsRouter.patch('/:id/status', requireRole('moderator'), validate(pathIdSchema, 'params'), validate(changeListingStatusSchema, 'body'), listingsController.changeStatus);
listingsRouter.delete('/:id', validate(pathIdSchema, 'params'), listingsController.remove);

export default listingsRouter;