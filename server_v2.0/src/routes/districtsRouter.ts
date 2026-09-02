import { Router } from "express";
import * as districtsController from "../controllers/districtsController";
import { validate } from "../middleware/validate";
import { pathIdSchema } from "../schemas/pathSchema";
import { createDistrictSchema, updateDistrictSchema } from "../schemas/districtsSchema";

const districtsRouter = Router();

districtsRouter.get('/', districtsController.list);
districtsRouter.get('/:id', validate(pathIdSchema, 'params'), districtsController.getById);
districtsRouter.post('/', validate(createDistrictSchema, 'body'), districtsController.create);
districtsRouter.put('/:id', validate(pathIdSchema, 'params'), validate(updateDistrictSchema, 'body'), districtsController.update);

export default districtsRouter;