import { Request, Response, NextFunction } from "express";
import { generateMessageService } from "../services/message.service.js";
import { AppError } from "../utils/app.error.js";

interface newRequest extends Request{
    user?:{
        id: string
    }
}

export const generateMessage = async(
    req: newRequest, 
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId) throw new AppError(401, "Unauthorized");

            const lendId = String(req.params.id);

            const message = await generateMessageService(userId, lendId);

            res.status(200).json(message);
        } catch (error) {
            next(error)
        }
    }