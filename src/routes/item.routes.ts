import { Request, Response, NextFunction, Router } from 'express'
import { createItem, deleteItem, filterByCategory, getAllItems, searchItem } from "../controllers/item.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

interface newRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const itemRouter = Router();

itemRouter.post('/', authenticateToken, createItem);
itemRouter.get('/', authenticateToken, (req: newRequest, res: Response, next: NextFunction) =>{
    if(req.query.category) return filterByCategory(req, res, next);

    return getAllItems(req, res, next);
});
itemRouter.get('/:id', authenticateToken, searchItem);
itemRouter.delete('/:id', authenticateToken, deleteItem);

export default itemRouter;