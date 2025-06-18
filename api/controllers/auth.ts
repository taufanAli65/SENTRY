import { Request, Response, NextFunction } from 'express';
import { register, login, resetPassword, forgotPassword, ChangePassword } from '../services/auth';
import { validateNewUserRole } from '../utils/registration_role';
import { sendSuccess } from '../utils/send_response';
import { validate } from '../utils/validate';
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '../validator/auth_validator';
import { AuthenticatedRequest } from '../types/auth_types';

export const registerEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, name, photoUrl, role } = validate(registerSchema, req.body);
        validateNewUserRole(role);

        await register(email, name, photoUrl, role);

        return sendSuccess(res, 201, "Email registration successfully sent", null);
    } catch (error) {
        next(error);
    }
}


export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, password } = validate(loginSchema, req.body);

        const result = await login(email, password);

        return sendSuccess(res, 200, "Login successful", result);
    } catch (error) {
      next(error);
    }
}

export const forgotPasswordHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email } = validate(forgotPasswordSchema, req.body);
        await forgotPassword(email);
        return sendSuccess(res, 200, "Password reset instructions sent to email", null);
    } catch (error) {
        next(error);
    }
}

export const resetPasswordHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const validated = validate(resetPasswordSchema, {
            params: req.params,
            body: req.body
        });
        await resetPassword(validated.params.token, validated.body.newPassword);
        return sendSuccess(res, 200, "Password successfully reset", null);
    } catch (error) {
        next(error);
    }
}

export const changePasswordHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { old_password, new_password } = validate(changePasswordSchema, req.body);
        await ChangePassword(old_password, new_password, req.user.email);
        return sendSuccess(res, 200, "Password successfully changed", null);
    } catch (error) {
        next(error);
    }
}