const authRouter = require('express').Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken, verifyRefreshToken } = require('../middleware/auth');
const { loginSchema, registerSchema } = require('../schemas/authSchema');

authRouter.get('/me', verifyAccessToken, authController.me);
authRouter.post('/register', validate(registerSchema, 'body'), authController.register);
authRouter.post('/login', validate(loginSchema, 'body'), authController.login);
authRouter.post('/refresh', verifyRefreshToken, authController.refresh);
authRouter.post('/logout', authController.logout);

module.exports = authRouter;