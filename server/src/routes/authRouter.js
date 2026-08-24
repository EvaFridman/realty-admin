const authRouter = require('express').Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { verifyAccessToken, verifyRefreshToken } = require('../middleware/auth');
const { loginSchema, registerSchema, changePasswordSchema } = require('../schemas/authSchema');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiters')

authRouter.get('/me', verifyAccessToken, authController.me);
authRouter.post('/register', registerLimiter, validate(registerSchema, 'body'), authController.register);
authRouter.post('/login', loginLimiter, validate(loginSchema, 'body'), authController.login);
authRouter.post('/refresh', verifyRefreshToken, authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.patch('/password', verifyAccessToken, validate(changePasswordSchema, 'body'), authController.updatePassword);

module.exports = authRouter;