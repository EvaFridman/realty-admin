const usersRouter = require('express').Router();
const usersController = require('../controllers/usersController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken, requireRole } = require('../middleware/auth');
const { pathIdSchema } = require('../schemas/pathSchema');
const { createUserSchema, updateUserSchema } = require('../schemas/usersSchema');

usersRouter.get('/', verifyAccessToken, requireRole('moderator'), usersController.list);
usersRouter.get('/:id', verifyAccessToken, requireRole('moderator'), validate(pathIdSchema, 'params'), usersController.getById);
usersRouter.post('/', verifyAccessToken, requireRole('moderator'), validate(createUserSchema, 'body'), usersController.create);
usersRouter.put('/:id', verifyAccessToken, requireRole('moderator'), validate(pathIdSchema, 'params'), validate(updateUserSchema, 'body'), usersController.update);

module.exports = usersRouter;