import { Router } from "express";
import * as authController from "../controllers/authController";
import { validate } from "../middleware/validate";
import { verifyAccessToken, verifyRefreshToken } from "../middleware/auth";
import { loginSchema, registerSchema, changePasswordSchema } from "../schemas/authSchema";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiters";
const authRouter = Router();

authRouter.get('/me', verifyAccessToken, authController.me);
authRouter.post('/register', registerLimiter, validate(registerSchema, 'body'), authController.register);
authRouter.post('/login', loginLimiter, validate(loginSchema, 'body'), authController.login);
authRouter.post('/refresh', verifyRefreshToken, authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.patch('/password', verifyAccessToken, validate(changePasswordSchema, 'body'), authController.updatePassword);

export default authRouter;