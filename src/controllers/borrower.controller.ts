import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app.error.js";
import * as borrowerService from "../services/borrower.service.js"

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