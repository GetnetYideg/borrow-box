import { createBorrowerInput } from "../models/borrower.model.js";
import prisma from "../../config/prisma.js";
import { AppError } from "../utils/app.error.js";

export const createBorrowerService = async (userId: string, data: createBorrowerInput) =>{
    try {
        const { name, notes } = data;
        const email = data.email;
        const phone = data.phone;

        if (!name){
            throw new AppError(400, "Insert required fields")
        }
        return await prisma.borrower.create({
            data: {
                name,
                phone,
                email,
                notes,
                lender:{
                    connect: {
                        id: userId
                    }
                }
            }
        })
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error("Registration failed:", error);
        throw error;
    }
}
export const getAllBorrowersService = async(userId: string) =>{
    try {
        return await prisma.borrower.findMany({
            where:{
                userId
            }
        })
    } catch (error) {
        console.log("Process Failed: ", error);
        throw error
    }
}

export const searchBorrowerService = async (userId: string, borrowerId: string) =>{
    try {
        const borrower = await prisma.borrower.findUnique({
            where: {
                id: borrowerId,
                userId
            }
        })

        if(!borrower) throw new AppError(404, "Borrower not found");

        return borrower;
    } catch (error) {
        console.log("Process failed: ", error);
        throw error
    }
}