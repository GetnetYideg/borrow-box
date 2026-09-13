import Joi from 'joi'

const corporateEmailRegex = /^[a-zA-Z0-9._%+-]+@company\.com$/;

export const createAccountSchema = Joi.object({
    name: Joi
        .string()
        .trim()
        .min(1)
        .max(255).
        required(),
    email: Joi
        .string()
        .lowercase()
        .pattern(corporateEmailRegex)
        .required()
        .messages({
            'string.pattern.base': 'Email must be a valid internal @company.com address.',
            'string.empty': 'Email cannot be left blank.',
            'any.required': 'Email is required.'
        }),
    password: Joi
        .string()
        .min(8)
        .max(50)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.max': 'Password cannot exceed 30 characters.',
            'string.empty': 'Password cannot be empty.',
            'any.required': 'Password is a required field.'
        }),
    confirmPassword: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match.',
            'any.required': 'Please confirm your password.'
        })
})