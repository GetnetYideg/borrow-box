import prisma from "../../config/prisma.js";
import { lendingInputModel } from "../models/lending.model.js";
import { AppError } from "../utils/app.error.js";

export const createLentdingService = async( userId:string, data: lendingInputModel) =>{
    try {
        const { itemId, borrowerId, expectedReturnDate, notes, status } = data;

        const item = await prisma.item.findUnique({
            where: {
                id: itemId
            }
        })
        if(!item) throw new AppError(404, "Item not found");

        if(item.status != "AVAILABLE") throw new AppError(400, "Item is unavailable");

        const updateItem = await prisma.item.update({
            data: {
                status: "UNAVAILABLE"
            },
            where: {
                id: itemId,
                userId
            }
        })
        if(!updateItem) throw new AppError(400, "Unexpected error");
        
        const borrowerExists = await prisma.borrower.findUnique({
            where: {
                id: borrowerId
            }
        })
        if(!borrowerExists) throw new AppError(404, "Borrower not found");

        return await prisma.lendingRecord.create({
            data: {
                expectedReturnDate,
                notes,
                status,
                user: {
                    connect:{
                        id: userId
                    }
                },
                borrower: {
                    connect: {
                        id: borrowerId
                    }
                },
                item:{
                    connect:{
                        id: itemId
                    }
                }
            }
        })
    } catch (error) {
        console.log("Process Failed: ", error);
        throw error   
    }
}