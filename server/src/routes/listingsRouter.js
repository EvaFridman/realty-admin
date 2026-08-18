const listingsRouter = require('express').Router();
const listingsController = require('../controllers/listingsController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken, requireRole } = require('../middleware/auth');
const { pathIdSchema } = require('../schemas/pathSchema');
const { createListingSchema, updateListingSchema, changeListingStatusSchema, listingsListQuerySchema } = require('../schemas/listingsSchema');

listingsRouter.get('/', verifyAccessToken, validate(listingsListQuerySchema, 'query'), listingsController.list);
listingsRouter.get('/:id', verifyAccessToken, validate(pathIdSchema, 'params'), listingsController.getById);
listingsRouter.post('/', verifyAccessToken, validate(createListingSchema, 'body'), listingsController.create);
listingsRouter.put('/:id', verifyAccessToken, validate(pathIdSchema, 'params'), validate(updateListingSchema, 'body'), listingsController.update);
listingsRouter.patch('/:id/status', verifyAccessToken, requireRole('moderator'), validate(pathIdSchema, 'params'), validate(changeListingStatusSchema, 'body'), listingsController.changeStatus);
listingsRouter.delete('/:id', verifyAccessToken, validate(pathIdSchema, 'params'), listingsController.remove);

module.exports = listingsRouter;