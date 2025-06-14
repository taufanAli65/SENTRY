import { Request, Response, NextFunction } from 'express';
import { register, login, resetPassword, forgotPassword, ChangePassword } from '../services/auth';
import { validateNewUserRole } from '../utils/registration_role';
import { sendSuccess } from '../utils/send_response';
import { validate } from '../utils/validate';
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, validateImageSchema } from '../validator/auth_validator';
import { AuthenticatedRequest } from '../types/auth_types';
import { AppError } from '../utils/app_error';
import { faceRecognitionPrediction } from '../services/mlservice';
import User from '../models/users';

export const registerEmployee = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, name, role } = validate(registerSchema, req.body);
        validateNewUserRole(role);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw AppError("User already exists", 409);
        }
        if (!req.file) {
            throw AppError("photo is required", 400);
        }
        // Validasi file foto
        const image = req.file as Express.Multer.File;
        validate(validateImageSchema, { file: image });
        // Register face recognition ke machine learning service
        await faceRecognitionPrediction(name, image);
        // Menyimpan foto ke direktori uploads
        const photoUrl = `/uploads/${req.file.filename}`;
        // Menyimpan data pengguna baru
        await register(email, name, photoUrl, role);

        return sendSuccess(res, 201, "Email registration successfully sent and photo has been recognized", null);
    } catch (error) {
        next(error);
    }
}


export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { email, password } = validate(loginSchema, req.body);

        const result = await login(email, password);
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        return sendSuccess(res, 200, "Login successful", result.user);
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