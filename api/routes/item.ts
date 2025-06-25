import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { UserRoles } from "../models/users";
import { createItem, getItems, getItem, deleteItem, getItemByCode  } from "../controllers/item";
import { uploadImage } from "../utils/upload_image";
import { Request, Response, NextFunction, Router } from "express";
import { asyncHandler } from "../utils/asyncHandler"; // <-- import utils

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRoles.Owner),
  uploadImage.single("photo"),
  asyncHandler(createItem)
);

router.get(
  "/code/:code",
  authenticate,
  authorize(UserRoles.Owner, UserRoles.Admin, UserRoles.Employee),
  asyncHandler(getItemByCode)
);

// GET all items (with pagination & search)
router.get(
  "/",
  authenticate,
  asyncHandler(authorize(UserRoles.Owner, UserRoles.Admin, UserRoles.Employee)),
  asyncHandler(getItems)
);

// GET item by id
router.get(
  "/:id",
  authenticate,
  asyncHandler(authorize(UserRoles.Owner, UserRoles.Admin, UserRoles.Employee)),
  asyncHandler(getItem)
);

// DELETE item by id
router.delete(
  "/:id",
  authenticate,
  authorize(UserRoles.Owner),
  asyncHandler(deleteItem)
);


export default router;
