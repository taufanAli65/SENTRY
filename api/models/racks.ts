import { Schema, model, Document, Types } from 'mongoose';

export interface iRack extends Document {
    item_code: string,
    weight: number,
    isOut: boolean,
    time: Date,
}

const rackSchema = new Schema({
    item_code: { type: String, ref: 'Item', required: true },
    weight: { type: Number, required: true },
    isOut: { type: Boolean, default: false, required: true },
}, {
    timestamps: { createdAt: 'time' }
});
const Rack = model<iRack>('Racks', rackSchema);
export default Rack;