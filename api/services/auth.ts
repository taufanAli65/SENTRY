import User, { UserRoles } from '../models/users';
import { LoginResponse, RegisterResult } from '../types/auth_types';
import { AppError } from '../utils/app_error';
import { comparePassword, generatePassword } from '../utils/password';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/send_email';


async function register(email: string, name: string, photoUrl: string, role: UserRoles): Promise<void> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw AppError("User already exists", 409);
    }
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
            login_url: `http://localhost:3000/auth/login`
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
    if (!email || !password) {
        throw AppError("Email and password are required", 400);
    }
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
        token: token
    };
}

export { register, login };