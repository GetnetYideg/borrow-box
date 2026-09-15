import Joi from 'joi';
import { Category, Status } from '../generated/prisma/enums.js';

export const itemInputSchema = Joi.object({
    name: Joi
        .string()
        .trim()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Name cannot be left blank.',
            'any.required': 'Name is required.'
        }),
    description: Joi
        .string()
        .allow(null),
    category: Joi
        .string()
        .valid(...Object.values(Category))
        .default(Category.OTHER),
    imageUrl: Joi
        .string()
        .uri()
        .allow(null),
    identifier: Joi
        .string()
        .allow(null),
    status: Joi
        .string()
        .valid(...Object.values(Status))
})