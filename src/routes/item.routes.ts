import { Router } from 'express'
import { createItem, getAllItems, searchItem } from "../controllers/item.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const itemRouter = Router();

itemRouter.post('/', authenticateToken, createItem);
itemRouter.get('/', authenticateToken, getAllItems);
itemRouter.get('/:id', authenticateToken, searchItem)

export default itemRouter;