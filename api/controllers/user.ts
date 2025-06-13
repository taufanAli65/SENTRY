import { AuthenticatedRequest } from "../types/auth_types";
import { Response, NextFunction } from "express";
import { sendSuccess } from "../utils/send_response";
import { getUserProfileByEmail } from "../services/userservice";

export const getUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const userProfile = await getUserProfileByEmail(req.user.email);

        return sendSuccess(res, 200, "User profile retrieved successfully", userProfile);
    } catch (error) {
        next(error);
    }
}