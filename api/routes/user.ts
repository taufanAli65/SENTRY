import { NextFunction, Request, Response, Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { AuthenticatedRequest } from "../types/auth_types";
import { getUserProfile } from "../controllers/user";
import { asyncHandler } from "../utils/asyncHandler"; // <-- import utils

const router = Router();

router.get(
  "/profile",
  asyncHandler(authenticate),
  asyncHandler((req: Request, res: Response, next: NextFunction) => {
    getUserProfile(req as unknown as AuthenticatedRequest, res, next);
  })
);

export default router;
