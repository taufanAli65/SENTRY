import { Router, Request, Response, NextFunction } from 'express';
import { addItem, getItems, getItem, updateItem, deleteItem } from '../controllers/items';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { UserRoles } from '../models/users';

const router = Router();

router.get("/", authenticate, async (req: Request, res: Response, next: NextFunction) => {getItems(req, res, next)});
router.get("/:id", authenticate, async (req: Request, res: Response, next: NextFunction) => {getItem(req, res, next)});
router.post("/", authenticate, authorize(UserRoles.Admin), async (req: Request, res: Response, next: NextFunction) => {addItem(req, res, next)});
router.put("/:id", authenticate, authorize(UserRoles.Admin), async (req: Request, res: Response, next: NextFunction) => {updateItem(req, res, next)});
router.delete("/:id", authenticate, authorize(UserRoles.Admin), async (req: Request, res: Response, next: NextFunction) => {deleteItem(req, res, next)});

export default router;