import User from '../models/users';
import { LoginResponse, RegisterResult } from '../types/auth_types';
import { AppError } from '../utils/app_error';
import { generatePassword, comparePassword } from '../utils/password';
import jwt from 'jsonwebtoken';


async function register(email: string, name: string, photoUrl: string): Promise<RegisterResult> {
    if (!email || !name || !photoUrl) {
        throw AppError("All fields are required", 400);
    }
    const passwords = await generatePassword(); // Naming it passwords because it containing both hashed and without hashed password.
    const user = new User({
        email,
        password: passwords.hashedPassword,
        name,
        photoUrl,
    });
    await user.save();
    // TODO: Send the password to the user via email instead of returning it in the response
    return {
        id: user._id.toString(),
        email: user.email,
        password: passwords.password, // Remove this in production!
        name: user.name,
        photoUrl: user.photoUrl,
        role: user.role
    };
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