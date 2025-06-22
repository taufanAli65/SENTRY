import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { UserRoles } from "../models/users";
import { asyncHandler } from "../utils/asyncHandler";
import { listUsers, suspendUser, unsuspendUser } from "../controllers/owner";

const router = Router();

router.get(
  "/users",
  authenticate,
  asyncHandler(authorize(UserRoles.Owner)),
  asyncHandler(listUsers)
);

router.post(
  "/users/:id/suspend",
  authenticate,
  asyncHandler(authorize(UserRoles.Owner)),
  asyncHandler(suspendUser)
);

router.post(
  "/users/:id/unsuspend",
  authenticate,
  asyncHandler(authorize(UserRoles.Owner)),
  asyncHandler(unsuspendUser)
);

export default router;
