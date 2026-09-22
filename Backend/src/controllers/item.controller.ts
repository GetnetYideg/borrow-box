import { Request, Response, NextFunction } from 'express'
import * as itemServices from '../services/item.service.js';
import { AppError } from '../utils/app.error.js';
import { Category } from '../generated/prisma/enums.js';
import { appendFile } from 'node:fs';

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

export const updateItem = async (
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId) throw new AppError(401, "Unauthorized");

            const itemId = String(req.params.id);
            if(!itemId) throw new AppError(400, "Id not provided");

            const result = await itemServices.updateItemService(userId, itemId, req.body)

            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }

export const deleteItem = async (
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId){
                throw new AppError(401, "Unauthorized");
            }
    
            const itemId = String(req.params.id);
            if(!itemId){
                throw new AppError(400, "Id not provided")
            }
    
            const result = await itemServices.deleteItemService(userId, itemId)
    
            res.status(200).json({
                deletedRows: result,
                message: "Record deleted successfully"
            })   
        } catch (error) {
            next(error);
        }
    }

export const filterByCategory = async (
    req: newRequest,
    res: Response, 
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId) throw new AppError(401, "Unauthorized");

            const category = parseCategory(req.query.category);

            if(!category) throw new AppError(400, "Invalid Category");

            const items = await itemServices.filterByCategoryService(userId, category)
            
            res.status(200).json(items)
        } catch (error) {
            next(error)
        }
    }


function parseCategory(value: unknown): Category | undefined {
  if (
    typeof value === "string" &&
    Object.values(Category).includes(value as Category)
  ) {
    return value as Category;
  }

  return undefined;
}
