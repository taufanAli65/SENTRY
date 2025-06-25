import { Request, Response, NextFunction } from 'express';
import { createScanService, updateScanService } from '../services/scans';
import { addScanSchema, updateScanSchema, scanIdSchema } from '../validator/scans_validator';
import { sendSuccess } from '../utils/send_response';
import { validate } from '../utils/validate';
import Scan from '../models/scans';
import { AppError } from '../utils/app_error';
import { startOfDay, endOfDay, format, addDays, addHours, setHours, setMinutes, setSeconds } from 'date-fns';


export const createScan = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id_user, id_item, isOut } = validate(addScanSchema, req.body);
        const result = await createScanService(id_user, id_item, isOut);
        return sendSuccess(res, 201, "Scan input item successfully", result);
    } catch (error) {
        next(error);
    }
};

export const updateScan = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = validate(scanIdSchema, req.params);
        const result = await updateScanService(id);
        return sendSuccess(res, 200, "Scan out item successfully", result);
    } catch (error) {
        next(error);
    }
};

export const getLastScanIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { item_code } = req.params;

    const scan = await Scan.findOne({
      item_code,
      isOut: false,
    }).sort({ createdAt: -1 });

    if (!scan) throw AppError('No Scan IN found', 404);

    sendSuccess(res, 200, 'Scan IN found', scan);
  } catch (error) {
    next(error);
  }
};

export const getScanSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalScanIn = await Scan.countDocuments({ isOut: false });
    const totalScanOut = await Scan.countDocuments({ isOut: true });

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const todayScanIn = await Scan.countDocuments({
      isOut: false,
      in_time: { $gte: todayStart, $lte: todayEnd },
    });

    const todayScanOut = await Scan.countDocuments({
      isOut: true,
      out_time: { $gte: todayStart, $lte: todayEnd },
    });

    sendSuccess(res, 200, 'Scan summary fetched successfully', {
      totalScanIn,
      totalScanOut,
      todayScanIn,
      todayScanOut,
    });
  } catch (err) {
    next(err);
  }
};


export const getChartDaily = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = 7;
    const labels: string[] = [];
    const scanIn: number[] = [];
    const scanOut: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const day = addDays(startOfDay(new Date()), -i);
      const dayEnd = endOfDay(day);

      const inCount = await Scan.countDocuments({
        isOut: false,
        in_time: { $gte: day, $lte: dayEnd },
      });

      const outCount = await Scan.countDocuments({
        isOut: true,
        out_time: { $gte: day, $lte: dayEnd },
      });

      labels.push(format(day, 'dd/MM'));
      scanIn.push(inCount);
      scanOut.push(outCount);
    }

    sendSuccess(res, 200, 'Daily chart data', { labels, scanIn, scanOut });
  } catch (err) {
    next(err);
  }
};

export const getChartHourly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const labels: string[] = [];
    const scanIn: number[] = [];
    const scanOut: number[] = [];

    for (let h = 0; h < 24; h++) {
      const start = setHours(setMinutes(setSeconds(now, 0), 0), h);
      const end = addHours(start, 1);

      const inCount = await Scan.countDocuments({
        isOut: false,
        in_time: { $gte: start, $lt: end },
      });

      const outCount = await Scan.countDocuments({
        isOut: true,
        out_time: { $gte: start, $lt: end },
      });

      labels.push(format(start, 'HH:00'));
      scanIn.push(inCount);
      scanOut.push(outCount);
    }

    sendSuccess(res, 200, 'Hourly chart data', { labels, scanIn, scanOut });
  } catch (err) {
    next(err);
  }
};

export const getScanHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await Scan.find()
      .sort({ in_time: -1 }) // atau createdAt
      .limit(50)
      .populate('id_user', 'name') // 🟢 ambil nama user
      .populate('id_item', 'name') // 🟢 ambil nama item

    sendSuccess(res, 200, 'Scan history fetched', history)
  } catch (err) {
    next(err)
  }
}



