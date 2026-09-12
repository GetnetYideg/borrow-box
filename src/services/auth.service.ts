import prisma from "../../config/prisma.js";
import { AppError } from "../utils/app.error.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import { 
    createAccountInput, 
    loginAccountInput 
} from "../models/auth.model.js";

export const register = async (data: createAccountInput) => {
    try{ 
        const {name, email, password} = data;
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing){
            throw new AppError(409, "Email already registered!");
        }

        const salt_round: number = Number(process.env.SALT_ROUND);        
        const hashedPassword = await bcrypt.hash(password, salt_round);

        return await prisma.user.create({
            data: {
                name: name,
                email: email,
                passwordHash: hashedPassword
            }
        });
    }catch(error){
        if (error instanceof AppError) throw error;
        console.error("Registration faild:", error);
        throw error;
    }
}