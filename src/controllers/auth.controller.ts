import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export const register = async (
    req: Request, 
    res: Response, 
    next: NextFunction): Promise<void> =>{
        try{
            const user = await authService.register(req.body);
            res.status(201).json(user);
        }catch(error){
            next(error);
        }
}