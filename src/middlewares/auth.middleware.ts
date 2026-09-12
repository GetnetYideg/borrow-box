import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app.error.js";
import prisma from "../../config/prisma.js";
import { decode } from "punycode";

interface TokenPayload {
  id: string; // Change to string if your DB uses UUID/CUID
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const authenticateToken = async (
    req: AuthRequest, 
    res: Response, 
    next: NextFunction)=>{
        try{
            const authHeader = req.body('authorization');
            const token = authHeader && authHeader.split(' ')[1];

            if(!token){
                res.status(401).json({message: "Access Denied, Token not provided"})
            }
        
            const secret = process.env.JWT_SECRET;
            if(!secret){
                throw new AppError(500, "JWT secret is not provided in environmental variable");
            }

            const decoded = await jwt.verify(token, secret) as TokenPayload;
            const user = await prisma.user.findUnique({
                where: {id: decoded.id},
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            })

            if(!user){
                throw new AppError(404, "User not Found!")
            }
            req.user = { id: user.id, name: user.name, email: user.email};
            next();
        }catch(error){
            if (error instanceof AppError) throw error;
            console.error("Registration faild:", error);
            throw error;
        }
}