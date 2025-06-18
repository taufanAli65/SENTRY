import { Schema, model, Document } from 'mongoose';

export interface iRackRealtime extends Document {
    weight: number;
    time: Date;
}

const rackRealtimeSchema = new Schema({
    weight: { type: Number, required: true },
    time: { type: Date, default: Date.now }
});

const RackRealtime = model<iRackRealtime>('RackRealtimes', rackRealtimeSchema);
export default RackRealtime;