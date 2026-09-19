import "dotenv/config";
import prisma from "../../config/prisma.js";
import { AppError } from "../utils/app.error.js";
import { createItemInput } from "../models/item.model.js";
import { connect } from "http2";
import { Category } from "../generated/prisma/enums.js";
import { useReducer } from "react";

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
        console.error("Registration failed:", error);
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
        console.error("Process failed", error)
        throw error
    }
}

export const searchItemService = async (userId: string, itemId: string) =>{
    try {
        const existing = await prisma.item.findUnique({where: {id: itemId}})
        if(!existing){
            throw new AppError(404, "Item not found");
        }
        const item = await prisma.item.findUnique({
            where: {
                id: itemId,
                userId
            }
        })

        return item;
    } catch (error) {
        console.error("Process failed", error);
        throw error;
    }
}

export const updateItemService = async( userId: string, itemId: string, newData: createItemInput ) =>{
    try {
        const data = await prisma.item.findUnique({
            where: {
                id: itemId,
                userId
            }
        })
        if(!data) throw new AppError(404, "Item not found");
        const { name, description, category, imageUrl, identifier, status } = newData;

        const updatedAt = new Date
        return await prisma.item.update({
            data: {
                name: name || data.name,
                description: description || data.description,
                category: category || data.category,
                imageUrl: imageUrl || data.imageUrl,
                identifier: identifier || data.identifier,
                status: status || data.status,
                updatedAt
            },
            where:{
                id: itemId,
                userId
            }
        })
    } catch (error) {
        console.log("Process Failed: ", error);
        throw error;
    }
}

export const deleteItemService = async (userId: string, itemId: string) =>{
    try {
        const existing = await prisma.item.findUnique({where: {id: itemId}})
        if(!existing){
            throw new AppError(404, "Item not found");
        }
        
        const result = await prisma.item.delete({
            where: {
                id: itemId,
                userId
            }
        })
    } catch (error) {
        console.log("Process failed: ", error)
        throw error
    }
}

export const filterByCategoryService = async (userId: string, category: Category) =>{
    try {
        const items = await prisma.item.findMany({
            where:{
                category
            }
        })
    
        if(!items){
            throw new AppError(404, "items not found")
        }
    
        return items;
    } catch (error) {
        console.log("Process Failed", error);
        throw error;
    }
}