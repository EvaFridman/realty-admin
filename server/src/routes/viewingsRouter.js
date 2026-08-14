const viewingsRouter = require('express').Router({ mergeParams: true });
const viewingsController = require('../controllers/viewingsController');
const { validate } = require('../middleware/validate');
const { pathIdSchema } = require('../schemas/pathSchema');
const { createViewingSchema } = require('../schemas/viewingsSchema');

viewingsRouter.get('/', validate(pathIdSchema, 'params'), viewingsController.list);
viewingsRouter.post('/', validate(pathIdSchema, 'params'), validate(createViewingSchema, 'body'), viewingsController.create);

module.exports = viewingsRouter;