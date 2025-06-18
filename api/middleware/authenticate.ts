import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRoles } from '../models/users';
import { AppError } from '../utils/app_error';

export interface AuthPayload {
    id: string;
    email: string;
    role: UserRoles;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw AppError('Authorization token missing', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
        req.user = decoded;
        next();
    } catch (err) {
        throw AppError('Invalid or expired token', 401);
    }
};
