import { Router, Request, Response, NextFunction } from 'express';
import {
    addWarehouseEntryController,
    getWarehouseEntriesController,
    getWarehouseEntryController
} from '../controllers/warehouse_entries';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { UserRoles } from '../models/users';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get("/", authenticate, asyncHandler(authorize(UserRoles.Owner)), async (req: Request, res: Response, next: NextFunction) => { getWarehouseEntriesController(req, res, next) });
router.get("/:id", authenticate, asyncHandler(authorize(UserRoles.Owner)), async (req: Request, res: Response, next: NextFunction) => { getWarehouseEntryController(req, res, next) });
router.post("/", authenticate, asyncHandler(authorize(UserRoles.Owner)), async (req: Request, res: Response, next: NextFunction) => { addWarehouseEntryController(req, res, next) });

export default router;
