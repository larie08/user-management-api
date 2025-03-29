//error.handler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    switch (true) {
        case typeof err === 'string':
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            res.status(statusCode).json({ message: err });
            break;
        default:
            res.status(500).json({ message: err.message });
            break;
    }
    next(err); 
}