import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app_error';
import { UserRoles } from '../models/users';

export const authorize = (...roles: UserRoles[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw AppError('Unauthorized', 401);
        }

        if (!roles.includes(req.user.role)) {
            throw AppError('Forbidden: insufficient permissions', 403);
        }

        next();
    };
};
