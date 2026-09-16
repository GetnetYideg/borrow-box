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
                throw new AppError(401, "Unauthorized")
            }
            const item = await itemServices.createItemService(req.body, userId)

            res.status(200).json(item);
        } catch (error) {
            next(error)
        }
}

export const getAllItems = async (
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId){
                throw new AppError(401, "Unauthorized")
            }
    
            const items = await itemServices.getAllItemsService(userId);
            
            res.status(200).json(items)
            
        } catch (error) {
            next(error)
        }
    }

export const searchItem = async (
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId){
                throw new AppError(401, "Unauthorized")
            }

            const itemId = String(req.params.id);
            if(!itemId){
                throw new AppError(400, "Id not provided")
            }
          
            const item = await itemServices.searchItemService(userId, itemId);

            res.status(200).json(item);
        } catch (error) {
            next(error);
        }
    }