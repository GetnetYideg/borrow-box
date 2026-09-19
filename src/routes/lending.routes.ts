import { Router } from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import { lendingSchema } from "../utils/lending.validation.js";
import { lending } from "../controllers/lending.controller.js";

const lendingRouter = Router();

lendingRouter.post('/', authenticateToken, validateBody(lendingSchema), lending);

export default lendingRouter;