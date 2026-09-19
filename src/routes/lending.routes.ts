import { Router } from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import { lendingSchema } from "../utils/lending.validation.js";
import { lendItem, listHistory, returnItem } from "../controllers/lending.controller.js";

const lendingRouter = Router();

lendingRouter.get('/', authenticateToken, listHistory)
lendingRouter.post('/', authenticateToken, validateBody(lendingSchema), lendItem);
lendingRouter.put('/return/:id', authenticateToken, returnItem);

export default lendingRouter;