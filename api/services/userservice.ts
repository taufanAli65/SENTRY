import User, { UserRoles } from "../models/users";
import { UserProfile } from "../types/profile_types";
import { AppError } from "../utils/app_error";
import { sendEmail } from "../utils/send_email";

export const getUserProfileByEmail = async (
  email: string
): Promise<UserProfile> => {
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

export const getUsers = async (
  page: number,
  limit: number,
  role?: UserRoles,
  search?: string
) => {
  const query: any = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  // Hanya admin & employee
  query.role = { $in: [UserRoles.Admin, UserRoles.Employee] };

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("-password -passwordResetToken -passwordResetExpires");

  return { users, total, page, limit };
};

export const suspendUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw AppError("User not found", 404);
  if (user.role === UserRoles.Owner)
    throw AppError("Cannot suspend owner", 403);

  user.suspended = true;
  await user.save();

  // Kirim email notifikasi
  await sendEmail({
    to: user.email,
    subject: "Your Account Has Been Suspended",
    templateName: "suspend_user",
    context: {
      name: user.name,
      role: user.role,
    },
  });

  return user;
};

export const unsuspendUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw AppError("User not found", 404);
  if (user.role === UserRoles.Owner)
    throw AppError("Cannot unsuspend owner", 403);

  user.suspended = false;
  await user.save();

  // Kirim email notifikasi
  await sendEmail({
    to: user.email,
    subject: "Your Account Has Been Unsuspended",
    templateName: "unsuspend_user",
    context: {
      name: user.name,
      role: user.role,
    },
  });

  return user;
};
