import { Schema, model, Document, Types } from 'mongoose';

export interface iRack extends Document {
    id_item: Types.ObjectId,
    weight: number,
    isOut: boolean,
    time: Date,
}

const rackSchema = new Schema({
    id_item: { type: Schema.Types.ObjectId, ref: 'Items', required: true },
    weight: { type: Number, required: true },
    isOut: { type: Boolean, default: false, required: true },
}, {
    timestamps: { createdAt: 'time' }
});
const Rack = model<iRack>('Racks', rackSchema);
export default Rack;