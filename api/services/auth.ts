import User from '../models/users';
import { generatePassword, comparePassword } from '../utils/password';
import jwt from 'jsonwebtoken';

interface RegisterResult {
    id: string;
    email: string;
    password: string;
    name: string;
    photoUrl: string;
    role: string;
}

async function register(email: string, name: string, photoUrl: string): Promise<RegisterResult> {
    if (!email || !name || !photoUrl) {
        throw new Error("All fields are required");
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

async function login(email: string, password: string): Promise<string> {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("There is no user with this email address");
    }
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
        throw new Error("Invalid Password");
    }
    const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );
    return token;
}

export { register, login };