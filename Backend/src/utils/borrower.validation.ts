import Joi from "joi"
export const createBorrowerSchema = Joi.object({
    name: Joi
        .string()
        .trim()
        .min(3)
        .required()
        .messages({
            'string.empty': 'Name cannot be left blank.',
            'any.required': 'Name is required.'
        }),
    phone: Joi
        .string()
        .trim()
        .pattern(/^(\+251|0)[97]\d{8}$/)
        .allow(null)
        .messages({
            'string.pattern.base': "Please insert a valid phone number"
        }),
    email: Joi
        .string()
        .trim()
        .pattern( /^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        .allow(null)
        .messages({
            'string.pattern.base': "Please insert a valid email account"
        }),
    notes: Joi
        .string()
        .allow(null),
}).or("email", "phone");