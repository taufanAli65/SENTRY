import mongoose, { Types } from 'mongoose';
import Rack from '../models/racks';
import RackRealtime from '../models/rack_realtimes';
import Item from '../models/item';
import { AppError } from '../utils/app_error';
import { RackResult } from '../types/rack_types';
import { checkWeightDiscrepancy } from '../utils/thief_suspection';

export async function createRackService(id_item: string, isOut: boolean): Promise<RackResult & { thiefSuspection?: string }> {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const item = await Item.findById(id_item).session(session);
        if (!item) throw AppError("Item not found", 404);

        // Get or create the single rack_realtime document
        let rackRealtime = await RackRealtime.findOne().session(session);
        let currentWeight = rackRealtime ? rackRealtime.weight : 0;

        // Update weight based on isOut
        if (isOut) {
            currentWeight -= item.weight;
        } else {
            currentWeight += item.weight;
        }

        // Create Rack entry
        const [rack] = await Rack.create([{
            id_item,
            weight: item.weight,
            isOut
        }], { session });

        // Update or create the single rack_realtime document
        if (rackRealtime) {
            rackRealtime.weight = currentWeight;
            rackRealtime.time = new Date();
            await rackRealtime.save({ session });
        } else {
            rackRealtime = new RackRealtime({
                weight: currentWeight,
                time: new Date()
            });
            await rackRealtime.save({ session });
        }

        await session.commitTransaction();

        // After transaction, check for thief suspection
        const thiefSuspection = await checkWeightDiscrepancy(25000); // Adjust threshold as needed, currently set to 25 seconds

        // Return RackResult, optionally with thiefSuspection message
        return {
            id: (rack._id as Types.ObjectId).toString(),
            id_item: rack.id_item,
            weight: rack.weight,
            isOut: rack.isOut,
            time: rack.time,
            ...(thiefSuspection ? { thiefSuspection } : {})
        };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}