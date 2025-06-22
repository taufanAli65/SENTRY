import { Router, Request, Response, NextFunction } from 'express';
import { createScan, updateScan } from '../controllers/scans';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { UserRoles } from '../models/users';
import { AuthenticatedRequest } from '../types/auth_types';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticate, asyncHandler(authorize(UserRoles.Employee)), (req: Request, res: Response, next: NextFunction) => { createScan(req as AuthenticatedRequest, res, next); }
);

router.put('/:id', authenticate, asyncHandler(authorize(UserRoles.Employee)), (req: Request, res: Response, next: NextFunction) => { updateScan(req as AuthenticatedRequest, res, next); }
);

export default router;
