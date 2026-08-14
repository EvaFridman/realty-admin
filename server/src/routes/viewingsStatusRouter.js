const viewingsStatusRouter = require('express').Router();
const viewingsController = require('../controllers/viewingsController');
const { validate } = require('../middleware/validate');
const { pathIdSchema } = require('../schemas/pathSchema');
const { changeViewingStatusSchema } = require('../schemas/viewingsSchema');

viewingsStatusRouter.patch('/:id/status', validate(pathIdSchema, 'params'), validate(changeViewingStatusSchema, 'body'), viewingsController.changeStatus);

module.exports = viewingsStatusRouter;