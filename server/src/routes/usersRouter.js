const usersRouter = require('express').Router();
const usersController = require('../controllers/usersController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken, requireRole } = require('../middleware/auth');
const { pathIdSchema } = require('../schemas/pathSchema');
const { createUserSchema, updateUserSchema } = require('../schemas/usersSchema');

usersRouter.use(verifyAccessToken);
usersRouter.use(requireRole('moderator'));

usersRouter.get('/', usersController.list);
usersRouter.get('/:id', validate(pathIdSchema, 'params'), usersController.getById);
usersRouter.post('/', validate(createUserSchema, 'body'), usersController.create);
usersRouter.put('/:id', validate(pathIdSchema, 'params'), validate(updateUserSchema, 'body'), usersController.update);

module.exports = usersRouter;