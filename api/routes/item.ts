import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { UserRoles } from "../models/users";
import { createItem } from "../controllers/item";
import { uploadImage } from "../utils/upload_image";
import { Request, Response, NextFunction, Router } from "express";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRoles.Owner),
  uploadImage.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    createItem(req, res, next);
  }
);

export default router;
