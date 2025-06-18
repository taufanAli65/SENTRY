import mongoose from 'mongoose';
import Scan from '../models/scans';
import ItemStock from '../models/item_stocks';
import Item from '../models/items';
import { AppError } from '../utils/app_error';
import { ScanResult } from '../types/scan_types';

// Item added to the shelf
export async function createScanService(id_user: string, id_item: string, isOut?: boolean): Promise<ScanResult> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const item = await Item.findById(id_item).session(session);
        if (!item) throw AppError("Item not found", 404);

        let itemStock = await ItemStock.findOne({ id_item }).session(session);
        if (!itemStock) {
            // Create new ItemStock if the item is scanned for the first time
            itemStock = new ItemStock({
                id_item,
                stock: 1,
                weight: item.weight
            });
            await itemStock.save({ session });
        } else {
            itemStock.stock += 1;
            itemStock.weight += item.weight;
            await itemStock.save({ session });
        }

        const scan = await Scan.create([{
            id_user,
            id_item,
            isOut: isOut ?? false
        }], { session });

        await session.commitTransaction();
        session.endSession();

        // Map to ScanResult
        const s = scan[0];
        return {
            id: (s._id as mongoose.Types.ObjectId).toString(),
            id_user: s.id_user,
            id_item: s.id_item,
            in_time: s.in_time,
            out_time: s.out_time,
            isOut: s.isOut,
        };
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
}

// Item taken from the shelf
export async function updateScanService(scanId: string): Promise<ScanResult> {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const scan = await Scan.findById(scanId).session(session);
        if (!scan) throw AppError("Scan not found", 404);
        if (scan.isOut) throw AppError("Scan already marked as out", 400);

        const item = await Item.findById(scan.id_item).session(session);
        if (!item) throw AppError("Item not found", 404);

        const itemStock = await ItemStock.findOne({ id_item: scan.id_item }).session(session);
        if (!itemStock) throw AppError("ItemStock not found", 404);

        scan.isOut = true;
        await scan.save({ session });

        itemStock.stock -= 1;
        itemStock.weight -= item.weight;
        await itemStock.save({ session });

        await session.commitTransaction();

        // Map to ScanResult
        return {
            id: (scan._id as mongoose.Types.ObjectId).toString(),
            id_user: scan.id_user,
            id_item: scan.id_item,
            in_time: scan.in_time,
            out_time: scan.out_time,
            isOut: scan.isOut,
        };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}

