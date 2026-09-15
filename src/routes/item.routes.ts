import { Router } from 'express'
import { createItem } from "../controllers/item.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const itemRouter = Router();

itemRouter.post('/', authenticateToken, createItem);

export default itemRouter;