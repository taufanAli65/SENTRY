import { Router, Request, Response, NextFunction } from 'express';
import { registerEmployee, loginUser, forgotPasswordHandler, resetPasswordHandler, changePasswordHandler } from '../controllers/auth';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { UserRoles } from '../models/users';
import { AuthenticatedRequest } from '../types/auth_types';
import { uploadImage } from '../utils/upload_image';

const router = Router();

router.post('/admin/register', authenticate, authorize(UserRoles.Owner), uploadImage.single('photo'), (req: Request, res: Response, next: NextFunction) => { registerEmployee(req, res, next); });
router.post('/login', (req: Request, res: Response, next: NextFunction) => { loginUser(req, res, next); });
router.post('/forgot-password', (req: Request, res: Response, next: NextFunction) => { forgotPasswordHandler(req, res, next); });
router.post('/reset-password/:token', (req: Request, res: Response, next: NextFunction) => { resetPasswordHandler(req, res, next); });
router.put('/change-password', authenticate, (req: Request, res: Response, next: NextFunction) => {
    changePasswordHandler(req as unknown as AuthenticatedRequest, res, next);
});
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logged out' })
})
export default router;