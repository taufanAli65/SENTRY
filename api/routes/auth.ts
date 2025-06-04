import { Router, Request, Response, NextFunction } from 'express';
import { registerEmployee, loginUser } from '../controllers/auth';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { UserRoles } from '../models/users';

const router = Router();

router.post('/admin/register', authenticate, authorize(UserRoles.Owner), (req: Request, res: Response, next: NextFunction) => { registerEmployee(req, res, next); });
router.post('/login', (req: Request, res: Response, next: NextFunction) => { loginUser(req, res, next); });

export default router;