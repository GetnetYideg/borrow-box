import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export const validateBody = (schema: Schema) =>{
    return (req: Request, res: Response,  next: NextFunction) =>{
        const { error, value } = schema.validate(req.body, {abortEarly: false});

        if(error){
            const errorMessages = error.details.map((detail) => detail.message);

            return res.status(400).json({error: errorMessages});
        }
        req.body = value;

        next();
    }
}