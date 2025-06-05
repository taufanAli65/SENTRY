import { Router, Request, Response, NextFunction } from 'express';
import { createScan, updateScan } from '../controllers/scans';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { UserRoles } from '../models/users';

const router = Router();

router.post('/', authenticate, authorize(UserRoles.Employee), (req: Request, res: Response, next: NextFunction) => { createScan(req, res, next); }
);

router.put('/:id', authenticate, authorize(UserRoles.Employee), (req: Request, res: Response, next: NextFunction) => { updateScan(req, res, next); }
);

export default router;
