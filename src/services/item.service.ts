import "dotenv/config";
import prisma from "../../config/prisma.js";
import { AppError } from "../utils/app.error.js";
import { createItemInput } from "../models/item.model.js";
import { connect } from "http2";

export const createItemService = async (data: createItemInput, userId: string) =>{
    try {
        const { name, description, category, imageUrl, identifier, status } = data;

        if( !name || !status ){
            throw new AppError(400, "Insert required fields");
        }

        return await prisma.item.create({
            data: {
                name, 
                description,
                category,
                imageUrl,
                identifier,
                status,
                owner: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error("Registration faild:", error);
        throw error;
    }
}

export const getAllItemsService = async (userId: string) =>{
    try {
        const items = await prisma.item.findMany({
            where:{
                userId
            }
        });
        
        return items
    } catch (error) {
        console.error("Process faild", error)
        throw error
    }
}