const listingPhotosRouter = require('express').Router({ mergeParams: true });
const photosController = require('../controllers/listingPhotosController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken } = require('../middleware/auth');
const { pathIdSchema, listingPhotoParamsSchema } = require('../schemas/pathSchema');
const { createPhotoSchema, updatePhotoSchema } = require('../schemas/listingPhotosSchema');

listingPhotosRouter.use(verifyAccessToken);

listingPhotosRouter.get('/', validate(pathIdSchema, 'params'), photosController.list);
listingPhotosRouter.post('/', validate(pathIdSchema, 'params'), validate(createPhotoSchema, 'body'), photosController.create);
listingPhotosRouter.put('/:photoId', validate(listingPhotoParamsSchema, 'params'), validate(updatePhotoSchema, 'body'), photosController.update);
listingPhotosRouter.delete('/:photoId', validate(listingPhotoParamsSchema, 'params'), photosController.remove);
listingPhotosRouter.patch('/:photoId/cover', validate(listingPhotoParamsSchema, 'params'), photosController.setCover);

module.exports = listingPhotosRouter;