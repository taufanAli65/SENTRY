import bcrypt from 'bcrypt';
import generator from 'generate-password';
import { GeneratedPassword } from '../types/auth_types';
import { AppError } from './app_error';

async function hashPassword(password: string): Promise<string> {
    if (!password) {
        throw AppError("Password is required", 400);
    }
    const saltRoundsEnv = process.env.SALT_ROUNDS;
    const saltRounds = saltRoundsEnv ? parseInt(saltRoundsEnv, 10) : 10;
    return await bcrypt.hash(password, saltRounds);
}

async function generatePassword(): Promise<GeneratedPassword> {
    const password = generator.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        strict: true,
    });
    const hashedPassword = await hashPassword(password);
    return { password, hashedPassword };
}

async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

export { generatePassword, comparePassword, hashPassword };