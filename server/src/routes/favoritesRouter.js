const favoritesRouter = require('express').Router({ mergeParams: true });
const favoritesController = require('../controllers/favoritesController');
const { validate } = require('../middleware/validate');
const { pathIdSchema, userFavoriteParamsSchema } = require('../schemas/pathSchema');
const { createFavoriteSchema, updateFavoriteSchema } = require('../schemas/favoritesSchema');

favoritesRouter.get('/', validate(pathIdSchema, 'params'), favoritesController.list);
favoritesRouter.post('/', validate(pathIdSchema, 'params'), validate(createFavoriteSchema, 'body'), favoritesController.create);
favoritesRouter.put('/:listingId', validate(userFavoriteParamsSchema, 'params'), validate(updateFavoriteSchema, 'body'), favoritesController.update);
favoritesRouter.delete('/:listingId', validate(userFavoriteParamsSchema, 'params'), favoritesController.remove);

module.exports = favoritesRouter;