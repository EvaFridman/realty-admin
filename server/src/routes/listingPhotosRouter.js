const listingPhotosRouter = require('express').Router({ mergeParams: true });
const photosController = require('../controllers/listingPhotosController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken } = require('../middleware/auth');
const { pathIdSchema, listingPhotoParamsSchema } = require('../schemas/pathSchema');
const { updatePhotoSchema } = require('../schemas/listingPhotosSchema');
const listingPhotosUpload = require('../middleware/uploadEntities/listingPhotos');
const checkListingAccess = require('../middleware/checkListingAccess');
const { uploadLimiter } = require('../middleware/rateLimiters')

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

module.exports = listingPhotosRouter;