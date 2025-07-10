import mongoose from 'mongoose';
import Scan from '../models/scans';
import ItemStock from '../models/item_stocks';
import Item from '../models/item';
import { AppError } from '../utils/app_error';
import { ScanResult } from '../types/scan_types';

export async function createScanService(id_user: string, code_item: string, isOut?: boolean): Promise<ScanResult> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const item = await Item.findOne({ item_code: code_item }).session(session);
        if (!item) throw AppError("Item not found", 404);

        // Check if item already has an active scan (not yet taken out)
        const existingScan = await Scan.findOne({ 
            id_item: item._id, 
            isOut: false 
        }).session(session);

        if (isOut) {
            // For "out" scan, item must have an existing "in" scan
            if (!existingScan) {
                throw AppError("Item is not currently in the warehouse. Cannot scan out.", 400);
            }
            
            // Update the existing scan to mark as out
            existingScan.isOut = true;
            existingScan.taken_by = new mongoose.Types.ObjectId(id_user);
            existingScan.taken_at = new Date();
            await existingScan.save({ session });

            // Update item stock
            const itemStock = await ItemStock.findOne({ id_item: item._id }).session(session);
            if (itemStock) {
                itemStock.stock -= 1;
                itemStock.weight -= item.weight;
                await itemStock.save({ session });
            }

            await session.commitTransaction();
            session.endSession();

            return {
                id: (existingScan._id as mongoose.Types.ObjectId).toString(),
                stocked_at: existingScan.stocked_at,
                stocked_by: existingScan.stocked_by,
                id_item: existingScan.id_item,
                in_time: existingScan.in_time,
                out_time: existingScan.out_time,
                isOut: existingScan.isOut,
                taken_by: existingScan.taken_by,
                taken_at: existingScan.taken_at,
            };
        } else {
            // For "in" scan, item must not have an existing active scan
            if (existingScan) {
                throw AppError("Item is already in the warehouse. Cannot scan in again.", 400);
            }

            // Create new "in" scan
            let itemStock = await ItemStock.findOne({ id_item: item._id }).session(session);
            if (!itemStock) {
                itemStock = new ItemStock({
                    id_item: item._id,
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
                stocked_by: id_user,
                stocked_at: new Date(),
                id_item: item._id,
                isOut: false
            }], { session });

            await session.commitTransaction();
            session.endSession();

            const s = scan[0];
            return {
                id: (s._id as mongoose.Types.ObjectId).toString(),
                stocked_at: s.stocked_at,
                stocked_by: s.stocked_by,
                id_item: s.id_item,
                in_time: s.in_time,
                out_time: s.out_time,
                isOut: s.isOut,
                taken_by: s.taken_by ?? null,
                taken_at: s.taken_at ?? null,
            };
        }
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
}


export async function getScanHistory(page: number, limit: number): Promise<{ scans: any[], total: number, page: number, limit: number }> {
    const skip = (page - 1) * limit;
    
    const scans = await Scan.find()
        .populate('id_item', 'item_code name')
        .populate('stocked_by', 'name')
        .populate('taken_by', 'name')
        .sort({ stocked_at: -1 })
        .skip(skip)
        .limit(limit);
    
    const total = await Scan.countDocuments();
    
    const formattedScans = scans.map(scan => ({
        id: (scan._id as mongoose.Types.ObjectId).toString(),
        item_code: (scan.id_item as any)?.item_code,
        item_name: (scan.id_item as any)?.name,
        stocked_by: scan.stocked_by,
        stocked_by_name: (scan.stocked_by as any)?.name,
        taken_by: scan.taken_by,
        taken_by_name: (scan.taken_by as any)?.name,
        stocked_at: scan.stocked_at,
        taken_at: scan.taken_at,
        isOut: scan.isOut,
        in_time: scan.in_time,
        out_time: scan.out_time
    }));
    
    return {
        scans: formattedScans,
        total,
        page,
        limit
    };
}
