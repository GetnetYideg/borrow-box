import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app.error.js";
import * as lendingService from "../services/lending.service.js";

interface newRequest extends Request{
    user?:{
        id: string
    }
}
export const lending = async(
    req: newRequest,
    res: Response,
    next: NextFunction) =>{
        try {
            const userId = req.user?.id;
            if(!userId) throw new AppError(401, "Unauthorized");

            const lending = await lendingService.createLentdingService(userId, req.body);

            res.status(201).json(lending);
        } catch (error) {
            next(error);
        }
    }