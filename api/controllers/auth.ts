import { Request, Response, NextFunction } from 'express';
import { register, login } from '../services/auth';
import { AppError } from '../utils/app_error';
import { sendEmail } from '../utils/send_email';
import { validateNewUserRole } from '../utils/registration_role';
import { generatePassword } from '../utils/password';

export const registerEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, name, photoUrl, role } = req.body;

        if (!email || !name || !photoUrl || !role) {
            throw AppError("All fields are required", 400);
        }

        validateNewUserRole(role);

        await register(email, name, photoUrl, role);

        return res.status(201).json({
            status: "success",
            message: "User registered successfully and welcome email sent"
        });

    } catch (error) {
        next(error);
    }
}


export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw AppError("Email and password are required", 400);
        }

        const result = await login(email, password);

        return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
}