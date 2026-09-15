import { Request, Response, NextFunction } from 'express'
import * as itemServices from '../services/item.service.js';
import { AppError } from '../utils/app.error.js';

interface newRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const createItem = async (
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if(!userId){
                throw new AppError(404, "Id not found")
            }
            const item = await itemServices.createItemService(req.body, userId)

            res.status(200).json(item);
        } catch (error) {
            next(error)
        }
}