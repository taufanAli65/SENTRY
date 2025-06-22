import { Router, Request, Response, NextFunction } from 'express';
import { createRack } from '../controllers/racks';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { UserRoles } from '../models/users';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.post('/', authenticate, asyncHandler(authorize(UserRoles.Admin)), (req: Request, res: Response, next: NextFunction) => { createRack(req, res, next); });

export default router;