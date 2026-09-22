import prisma from "../../config/prisma.js"
import { AppError } from "../utils/app.error.js"
import { generateDuesoonMessage, generateOverdueMessage } from "../utils/generate.message.js";

export const generateMessageService = async(userId: string, lendId: string) =>{
    try {
        const record = await prisma.lendingRecord.findUnique({
            where: {
                id: lendId,
                userId
            },
            select: {
                itemId: true,
                borrowerId: true,
                expectedReturnDate: true,
                status: true
            }
        })

        if(!record) throw new AppError(404, "Record not found");

        if(record.status == "RETURNED") return {
            message: "The item is already returned."
        }

        const item = await prisma.item.findUnique({
            where: {
                id: record.itemId
            },
            select: {
                name: true
            }
        })

        const borrower = await prisma.borrower.findUnique({
            where: {
                id: record.borrowerId
            },
            select: {
                name: true
            }
        })

        const userData = {
            user: undefined,
            item: item?.name,
            borrower: borrower?.name,
            dueDate: new Date(record.expectedReturnDate)
        }
        
        if(record.status == "DUESOON") return {
            message: generateDuesoonMessage(userData)
        }
        if(record.status == "OVERDUE")return {
            message: generateOverdueMessage(userData)
        }
        
        return {
            message: "The borrower has time to return it."
        }
    } catch (error) {
        console.log("Process Failed: ", error);
        throw error;
    }
}