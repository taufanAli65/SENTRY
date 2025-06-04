import { Request, Response, NextFunction } from 'express';
import { register, login } from '../services/auth';
import { AppError } from '../utils/app_error';
import { validateNewUserRole } from '../utils/registration_role';
import { sendSuccess } from '../utils/send_response';
import { validate } from '../utils/validate';
import { loginSchema, registerSchema } from '../validator/auth_validator';

export const registerEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, name, photoUrl, role } = validate(registerSchema, req.body);
        if (!email || !name || !photoUrl || !role) {
            throw AppError("Email, name, photoUrl, and role are required", 400);
        }

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
        if (!email || !password) {
            throw AppError("Email and password are required", 400);
        }

        const result = await login(email, password);

        return sendSuccess(res, 200, "Login successful", result);
    } catch (error) {
      next(error);
    }
}