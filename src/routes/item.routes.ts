import { Router } from 'express'
import { createItem, deleteItem, getAllItems, searchItem } from "../controllers/item.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const itemRouter = Router();

itemRouter.post('/', authenticateToken, createItem);
itemRouter.get('/', authenticateToken, getAllItems);
itemRouter.get('/:id', authenticateToken, searchItem);
itemRouter.delete('/:id', authenticateToken, deleteItem);

export default itemRouter;