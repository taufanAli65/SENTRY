import { Router, Request, Response, NextFunction } from "express";
import {
  registerEmployee,
  loginUser,
  forgotPasswordHandler,
  resetPasswordHandler,
  changePasswordHandler,
} from "../controllers/auth";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { UserRoles } from "../models/users";
import { AuthenticatedRequest } from "../types/auth_types";
import { uploadImage } from "../utils/upload_image";
import { asyncHandler } from "../utils/asyncHandler"; // <-- import utils

const router = Router();

router.post(
  "/admin/register",
  authenticate,
  asyncHandler(authorize(UserRoles.Owner)),
  uploadImage.single("photo"),
  asyncHandler(registerEmployee)
);
router.post("/login", asyncHandler(loginUser));
router.post("/forgot-password", asyncHandler(forgotPasswordHandler));
router.post("/reset-password/:token", asyncHandler(resetPasswordHandler));
router.put(
  "/change-password",
  authenticate,
  asyncHandler((req: Request, res: Response, next: NextFunction) => {
    changePasswordHandler(req as unknown as AuthenticatedRequest, res, next);
  })
);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});
export default router;
