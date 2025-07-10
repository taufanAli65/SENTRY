import mongoose, { Types } from 'mongoose';
import Rack from '../models/racks';
import RackRealtime from '../models/rack_realtimes';
import Item from '../models/item';
import { AppError } from '../utils/app_error';
import { RackResult } from '../types/rack_types';
import { checkTimeDifferent } from '../utils/thief_suspection';

export async function createRackService(weight: number, isOut: boolean): Promise<RackResult & { thiefSuspection?: string }> {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // Get or create the single rack_realtime document
        let rackRealtime = await RackRealtime.findOne().session(session);
        let currentWeight = rackRealtime ? rackRealtime.weight : 0;

        // Update weight based on isOut
        if (isOut) {
            currentWeight -= weight;
        } else {
            currentWeight += weight;
        }

        // Create Rack entry
        const [rack] = await Rack.create([{
            weight,
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
        const thiefSuspection = await checkTimeDifferent(25000); // Adjust threshold as needed, currently set to 25 seconds

        // Return RackResult, optionally with thiefSuspection message
        return {
            id: (rack._id as Types.ObjectId).toString(),
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