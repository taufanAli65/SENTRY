import { Router, Request, Response, NextFunction } from 'express';
import { registerEmployee, loginUser } from '../controllers/auth';

const router = Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => { registerEmployee(req, res, next); });
router.post('/login', (req: Request, res: Response, next: NextFunction) => { loginUser(req, res, next); });

export default router;