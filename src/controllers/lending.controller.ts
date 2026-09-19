import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app.error.js";
import * as lendingService from "../services/lending.service.js";

interface newRequest extends Request{
    user?:{
        id: string
    }
}
export const lendItem = async(
    req: newRequest,
    res: Response,
    next: NextFunction) =>{
        try {
            const userId = req.user?.id;
            if(!userId) throw new AppError(401, "Unauthorized");

            const lending = await lendingService.lendItemService(userId, req.body);

            res.status(201).json(lending);
        } catch (error) {
            next(error);
        }
    }

export const returnItem = async(
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
           const userId = req.user?.id;
           if(!userId) throw new AppError(401, "Unauthorized");
           
           const lendId = String(req.params.id);

           const data = await lendingService.returnItemService(userId, lendId)

           res.status(200).json(data);
        } catch (error) {
            next(error)
        }
    }

export const listHistory = async (
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId) throw new AppError(401, "Unauthorized");
    
            const historyData = await lendingService.lendingHistoryService(userId);
            res.status(200).json(historyData);  
        } catch (error) {
            next(error)
        }
    }