import crypto from 'crypto';
import User, { UserRoles } from '../models/users';
import { LoginResponse } from '../types/auth_types';
import { AppError } from '../utils/app_error';
import { comparePassword, generatePassword, hashPassword } from '../utils/password';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/send_email';


async function register(email: string, name: string, photoUrl: string, role: UserRoles): Promise<void> {
    const passwords = await generatePassword();
    await sendEmail({
        to: email,
        subject: 'Account Created',
        templateName: 'account_created',
        context: {
            name,
            email,
            password: passwords.password, // unhashed password
            role,
            login_url: `http://localhost:${process.env.PORT}/auth/login`
        }
    });
    const user = new User({
        email,
        password: passwords.hashedPassword,
        name,
        photoUrl,
        role
    });
    await user.save();
}

async function login(email: string, password: string): Promise<LoginResponse> {
    const user = await User.findOne({ email });
    if (!user) {
        throw AppError("User not found", 404);
    }
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
        throw AppError("Invalid password", 401);
    }
    const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );
    return {
        user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
        },
        token
    };
}


async function forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
        throw AppError("User not found", 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        templateName: 'reset_password',
        context: {
            name: user.name,
            resetUrl: `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        }
    });
}

async function resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw AppError("Invalid or expired reset token", 400);
    }
    const password = await hashPassword(newPassword);
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
}

async function ChangePassword(old_password: string, new_password: string, email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
        throw AppError("User not found", 404);
    }
    const isValid = await comparePassword(old_password, user.password);
    if (!isValid) {
        throw AppError("Invalid password", 401);
    }
    const password = await hashPassword(new_password);
    user.password = password;
    await user.save();
}

export { register, login, forgotPassword, resetPassword, ChangePassword };