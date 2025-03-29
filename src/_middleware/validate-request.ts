//validate requests
import { Request, NextFunction } from 'express';
import { Schema } from 'joi';

export function validateRequest(req: Request, next: NextFunction, schema: Schema) {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    };

    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}