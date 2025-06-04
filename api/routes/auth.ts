import { Router, Request, Response } from 'express';
import { registerEmployee, loginUser } from '../controllers/auth';

const router = Router();

router.post('/register', (req: Request, res: Response) => { registerEmployee(req, res); });
router.post('/login', (req: Request, res: Response) => { loginUser(req, res); });

export default router;