import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app_error';
import { UserRoles } from '../models/users';
import { AuthenticatedRequest } from '../types/auth_types';

export const authorize = (...roles: UserRoles[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw AppError('Unauthorized', 401);
        }

        if (!roles.includes(req.user.role as UserRoles)) {
            throw AppError('Forbidden: insufficient permissions', 403);
        }

        next();
    };
};
