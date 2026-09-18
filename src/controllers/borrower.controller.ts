import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app.error.js";
import * as borrowerService from "../services/borrower.service.js"
import { truncate } from "fs";
import app from "../app.js";

interface newRequest extends Request{
    user?:{
        id: string,
    }
}

export const createBorrower = async (
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId) throw new AppError(401, "Unauthorized");
    
            const borrower = await borrowerService.createBorrowerService(userId, req.body);
    
            res.status(200).json(borrower);
            
        } catch (error) {
            next(error)
        }
    }
export const getAllBorrowers = async(
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId){
                throw new AppError(401, "Unauthorized");
            }
            const borrowers = await borrowerService.getAllBorrowersService(userId);

            res.status(200).json(borrowers);
        } catch (error) {
            next(error)
        }
    }

export const searchBorrower = async (
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId) throw new AppError(401, "Unauthorized");
    
            const borrowerId = String(req.params.id);
    
            const borrower = await borrowerService.searchBorrowerService(userId, borrowerId);
    
            res.status(200).json(borrower)
        } catch (error) {
            next(error);
        }
    }
