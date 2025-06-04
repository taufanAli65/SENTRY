import { Request, Response } from 'express';
import { register, login } from '../services/auth';

export const registerEmployee = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { email, name, photoUrl } = req.body;
        if (!email || !name || !photoUrl) {
            return res.status(400).json({ error: "Email, name, and photoUrl are required" });
        }

        const result = await register(email, name, photoUrl);

        // TODO: Send the password to the user via email instead of returning it in the response
        res.status(201).json({
            id: result.id,
            email: result.email,
            name: result.name,
            photoUrl: result.photoUrl,
            role: result.role,
            password: result.password // Remove this in production!
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).send({ error: errorMessage });
    }
}

export const loginUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const result = await login(email, password);

        res.status(200).json(result);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(401).send({ error: errorMessage });
    }
}