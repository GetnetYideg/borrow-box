import { Router } from 'express'
import { validateBody } from '../middlewares/validation.middleware.js'
import { createAccountSchema } from '../utils/auth.validation.js';
import { register } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/register', validateBody(createAccountSchema), register);

export default authRouter;