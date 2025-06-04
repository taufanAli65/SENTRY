import { Router, Request, Response, NextFunction } from 'express';
import { addItem, getItems, getItem } from '../controllers/items';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.get("/", authenticate, async (req: Request, res: Response, next: NextFunction) => {getItems(req, res, next)});
router.get("/:id", authenticate, async (req: Request, res: Response, next: NextFunction) => {getItem(req, res, next)});
router.post("/", authenticate, async (req: Request, res: Response, next: NextFunction) => {addItem(req, res, next)});


export default router;