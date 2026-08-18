const viewingsStatusRouter = require('express').Router();
const viewingsController = require('../controllers/viewingsController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken, requireRole } = require('../middleware/auth');
const { pathIdSchema } = require('../schemas/pathSchema');
const { changeViewingStatusSchema, viewingsListQuerySchema } = require('../schemas/viewingsSchema');

viewingsStatusRouter.get('/', verifyAccessToken, requireRole('moderator'), validate(viewingsListQuerySchema, 'query'), viewingsController.listAll);
viewingsStatusRouter.patch('/:id/status', verifyAccessToken, requireRole('moderator'), validate(pathIdSchema, 'params'), validate(changeViewingStatusSchema, 'body'), viewingsController.changeStatus);

module.exports = viewingsStatusRouter;