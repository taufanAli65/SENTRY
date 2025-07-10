import { Schema, model, Document } from 'mongoose';

export interface iRack extends Document {
    weight: number,
    isOut: boolean,
    time: Date,
}

const rackSchema = new Schema({
    weight: { type: Number, required: true },
    isOut: { type: Boolean, default: false, required: true },
}, {
    timestamps: { createdAt: 'time' }
});
const Rack = model<iRack>('Racks', rackSchema);
export default Rack;