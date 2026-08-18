const viewingsStatusRouter = require('express').Router();
const viewingsController = require('../controllers/viewingsController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken, requireRole } = require('../middleware/auth');
const { pathIdSchema } = require('../schemas/pathSchema');
const { changeViewingStatusSchema, viewingsListQuerySchema } = require('../schemas/viewingsSchema');

router.use(verifyAccessToken);
router.use(requireRole('moderator'));

viewingsStatusRouter.get('/', validate(viewingsListQuerySchema, 'query'), viewingsController.listAll);
viewingsStatusRouter.patch('/:id/status', validate(pathIdSchema, 'params'), validate(changeViewingStatusSchema, 'body'), viewingsController.changeStatus);

module.exports = viewingsStatusRouter;