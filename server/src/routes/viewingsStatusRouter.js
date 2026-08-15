const viewingsStatusRouter = require('express').Router();
const viewingsController = require('../controllers/viewingsController');
const { validate } = require('../middleware/validate');
const { pathIdSchema } = require('../schemas/pathSchema');
const { changeViewingStatusSchema, viewingsListQuerySchema } = require('../schemas/viewingsSchema');

viewingsStatusRouter.get('/', validate(viewingsListQuerySchema, 'query'), viewingsController.listAll);
viewingsStatusRouter.patch('/:id/status', validate(pathIdSchema, 'params'), validate(changeViewingStatusSchema, 'body'), viewingsController.changeStatus);

module.exports = viewingsStatusRouter;