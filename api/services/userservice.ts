import User from "../models/users"
import { UserProfile } from "../types/profile_types";
import { AppError } from "../utils/app_error";


export const getUserProfileByEmail = async (email: string): Promise<UserProfile> => {
    const user = await User.findOne({ email });
    if (!user) {
        throw AppError("User not found", 404);
    }
    return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl,
        role: user.role,
    };
};