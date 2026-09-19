import Joi from "joi";
import { LendingStatus } from "../generated/prisma/enums.js";

export const lendingSchema = Joi.object({
    itemId: Joi
        .string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'ID must be a valid UUID',
            'string.empty': 'ID is required',
        }),
    borrowerId: Joi
        .string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'ID must be a valid UUID',
            'string.empty': 'Please insert all required fields',
        }),
    expectedReturnDate: Joi
        .date()
        .required()
        .messages({
            'string.empty': "Please insert all required fields"
        }),
    notes: Joi  
        .string()
        .allow(null),
    status: Joi
        .string()
        .valid(...Object.values(LendingStatus))
})