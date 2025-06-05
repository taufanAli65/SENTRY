import mongoose from 'mongoose';
import Scan from '../models/scans';
import ItemStock from '../models/item_stocks';
import Item from '../models/items';
import { AppError } from '../utils/app_error';

// Item added to the shelf
export async function createScanService(id_user: string, id_item: string, isOut?: boolean) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const item = await Item.findById(id_item).session(session);
        if (!item) throw AppError("Item not found", 404);

        const itemStock = await ItemStock.findOne({ id_item }).session(session);
        if (!itemStock) throw AppError("ItemStock not found", 404);

        const scan = await Scan.create([{
            id_user,
            id_item,
            isOut: isOut ?? false
        }], { session });

        itemStock.stock += 1;
        itemStock.weight += item.weight;
        await itemStock.save({ session });

        await session.commitTransaction();
        session.endSession();
        return scan[0];
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
} // TODO: implement types

// Item taken from the shelf
export async function updateScanService(scanId: string) {
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
        return scan;
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
} // TODO: implement types

