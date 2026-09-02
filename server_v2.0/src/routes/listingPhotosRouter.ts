import { Router } from "express";
import * as photosController from "../controllers/listingPhotosController";
import { validate } from "../middleware/validate";
import { verifyAccessToken } from "../middleware/auth";
import { pathIdSchema, listingPhotoParamsSchema } from "../schemas/pathSchema";
import { updatePhotoSchema } from "../schemas/listingPhotosSchema";
import { listingPhotosUpload } from "../middleware/uploadEntities/listingPhotos";
import { checkListingAccess } from "../middleware/checkListingAccess";
import { uploadLimiter } from "../middleware/rateLimiters";

const listingPhotosRouter = Router({ mergeParams: true });

listingPhotosRouter.post('/', uploadLimiter, verifyAccessToken, validate(pathIdSchema, 'params'), checkListingAccess,
    (req, res, next) => {
        listingPhotosUpload(req, res, (err) => {
            if (err) return next(err);
            next();
        });
    },
    photosController.create
);

listingPhotosRouter.use(verifyAccessToken);

listingPhotosRouter.get('/', validate(pathIdSchema, 'params'), checkListingAccess, photosController.list);

listingPhotosRouter.use(validate(listingPhotoParamsSchema, 'params'), checkListingAccess);

listingPhotosRouter.put('/:photoId', validate(updatePhotoSchema, 'body'), photosController.update);
listingPhotosRouter.delete('/:photoId', photosController.remove);
listingPhotosRouter.patch('/:photoId/cover', photosController.setCover);

export default listingPhotosRouter;