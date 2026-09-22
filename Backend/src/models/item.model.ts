import { Category, Status } from "../generated/prisma/enums.js";

export interface createItemInput{
    name: string,
    description: string,
    category: Category,
    imageUrl: string,
    identifier: string,
    status: Status
}