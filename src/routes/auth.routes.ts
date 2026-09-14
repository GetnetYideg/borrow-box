import { Router } from 'express'
import { validateBody } from '../middlewares/validation.middleware.js'
import { createAccountSchema, loginAccountSchema } from '../utils/auth.validation.js';
import { register, login, logout, refreshAccessToken } from '../controllers/auth.controller.js';
import authenticateToken from "../middlewares/auth.middleware.js"

const authRouter = Router();

authRouter.post('/register', validateBody(createAccountSchema), register);
authRouter.post('/login', validateBody(loginAccountSchema), login)
authRouter.post('/logout', authenticateToken, logout)
authRouter.post('/refresh', refreshAccessToken)

export default authRouter;