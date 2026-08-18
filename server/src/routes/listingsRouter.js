const listingsRouter = require('express').Router();
const listingsController = require('../controllers/listingsController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken, requireRole } = require('../middleware/auth');
const { pathIdSchema } = require('../schemas/pathSchema');
const { createListingSchema, updateListingSchema, changeListingStatusSchema, listingsListQuerySchema } = require('../schemas/listingsSchema');

listingsRouter.get('/', validate(listingsListQuerySchema, 'query'), listingsController.list);

listingsRouter.use(verifyAccessToken);

listingsRouter.get('/:id', validate(pathIdSchema, 'params'), listingsController.getById);
listingsRouter.post('/', validate(createListingSchema, 'body'), listingsController.create);
listingsRouter.put('/:id', validate(pathIdSchema, 'params'), validate(updateListingSchema, 'body'), listingsController.update);
listingsRouter.patch('/:id/status', requireRole('moderator'), validate(pathIdSchema, 'params'), validate(changeListingStatusSchema, 'body'), listingsController.changeStatus);
listingsRouter.delete('/:id', validate(pathIdSchema, 'params'), listingsController.remove);

module.exports = listingsRouter;