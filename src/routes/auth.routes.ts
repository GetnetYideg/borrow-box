import { Router } from 'express'
import { validateBody } from '../middlewares/validation.middleware.js'
import { createAccountSchema, loginAccountSchema } from '../utils/auth.validation.js';
import { register, login } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/register', validateBody(createAccountSchema), register);
authRouter.post('/login', validateBody(loginAccountSchema), login)

export default authRouter;