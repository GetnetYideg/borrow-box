import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export const register = async (
    req: Request, 
    res: Response, 
    next: NextFunction): Promise<void> =>{
        try{
            const user = await authService.registerationService(req.body);
            res.status(201).json(user);
        }catch(error){
            next(error);
        }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> =>{
        try{
            const info = await authService.loginService(req.body);
            const { data, accessToken, refreshToken } = info;
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.status(200).json({
                data, 
                accessToken
            });
        }catch(error){
            next(error)
        }
    }

export const logout = (
    req: Request,
    res: Response,
    next: NextFunction) =>{
        try {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });
            res.status(200).json({
                message: "Logout successfully"
            })
        } catch (error) {
            next(error)
        }
    }