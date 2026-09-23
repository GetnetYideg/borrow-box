import prisma from "../../config/prisma.js";
import { AppError } from "../utils/app.error.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import {
    createAccountInput,
    loginAccountInput
} from "../models/auth.model.js";
import { signAccessToken, signRefreshToken } from "../utils/generate.token.js";

export const registerationService = async (data: createAccountInput) => {
    try {
        const { name, email, password } = data;
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
            throw new AppError(409, "Email already registered!");
        }

        const salt_round: number = Number(process.env.SALT_ROUND) || 10;
        const hashedPassword = await bcrypt.hash(password, salt_round);

        return await prisma.user.create({
            data: {
                name: name,
                email: email,
                passwordHash: hashedPassword
            }
        });
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error("Registration faild:", error);
        throw error;
    }
}

export const loginService = async (data: loginAccountInput) => {
    try {
        const { email, password } = data;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true
            }
        });

        if (!user) {
            throw new AppError(401, "Inalid cridential")
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            throw new AppError(401, "Invalid cridential")
        }

        const accessToken = signAccessToken({ userId: user.id })
        const refreshToken = signRefreshToken({ userId: user.id })

        return {
            data: user,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error("Login failed:", error);
        throw error;
    }
}