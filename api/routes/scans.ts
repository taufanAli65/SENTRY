import { Router, Request, Response, NextFunction } from 'express';
import { createScan, updateScan, getLastScanIn, getScanSummary } from '../controllers/scans';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { UserRoles } from '../models/users';
import { asyncHandler } from '../utils/asyncHandler';
import { getChartDaily, getChartHourly } from '../controllers/scans';
import { getScanHistory } from '../controllers/scans';


const router = Router();

router.post('/', authenticate, authorize(UserRoles.Owner), (req: Request, res: Response, next: NextFunction) => { createScan(req, res, next); }
);

router.put('/:id', authenticate, authorize(UserRoles.Owner  ), (req: Request, res: Response, next: NextFunction) => { updateScan(req, res, next); }
);

router.get(
  '/in/:item_code',
  authenticate,
  authorize(UserRoles.Owner, UserRoles.Admin, UserRoles.Employee),
  asyncHandler(getLastScanIn)
);
router.get(
  '/summary',
  authenticate,
  authorize(UserRoles.Owner, UserRoles.Admin),
  asyncHandler(getScanSummary)
);


router.get(
  '/chart/daily',
  authenticate,
  authorize(UserRoles.Owner, UserRoles.Admin),
  asyncHandler(getChartDaily)
);

router.get(
  '/chart/hourly',
  authenticate,
  authorize(UserRoles.Owner, UserRoles.Admin),
  asyncHandler(getChartHourly)
);

router.get(
  '/history',
  authenticate,
  authorize(UserRoles.Owner, UserRoles.Admin),
  asyncHandler(getScanHistory)
)
export default router;
