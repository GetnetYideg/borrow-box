import { Request, Response, NextFunction } from "express";
import * as reminderService from "../services/reminder.service.js";
import { AppError } from "../utils/app.error.js";

interface newRequest extends Request{
    user?: {
        id: string
    }
}

export const reminder = async(
    req: newRequest,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try {
            const userId = req.user?.id;
            if(!userId) throw new AppError(401, "Unauthorized");
    
            const lendId = String(req.params.id);
    
            const reminderMessage = await reminderService.dueDateReminderService(userId, lendId);
    
            res.status(200).json(reminderMessage)
        } catch (error) {
            next(error);
        }
    }