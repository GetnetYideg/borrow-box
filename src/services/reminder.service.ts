import prisma from "../../config/prisma.js";
import { AppError } from "../utils/app.error.js"
import { dueSoonReminderMessage, overdueReminderMessage } from "../utils/generate.message.js";
export const dueDateReminderService = async(userId: string, lendId: string) =>{
    try {
        const data = await prisma.lendingRecord.findUnique({
            where: {
                id: lendId,
                userId
            },
            select:{
                itemId: true,
                borrowerId: true,
                expectedReturnDate: true,
                status: true
            }
        })
        if(!data) throw new AppError(404, "Record not found");
    
        const { itemId, borrowerId, expectedReturnDate, status } = data;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                name: true
            }
        })
        const item = await prisma.item.findUnique({
            where: {
                id: itemId
            },
            select: { name: true }
        })
        const borrower = await prisma.borrower.findUnique({
            where: {
                id: borrowerId
            },
            select: {
                name: true
            }
        })
        const dueData = {
            user: user?.name,
            item: item?.name,
            borrower: borrower?.name,
            dueDate: new Date(expectedReturnDate)
        }
        if(status == "DUESOON") return { message: dueSoonReminderMessage(dueData)};
        if(status == "OVERDUE") return { message: overdueReminderMessage(dueData)};
        return {message: "The borrower has time to return"}
    } catch (error) {
        console.log("Process Failed: ", error)
        throw error
    }
}