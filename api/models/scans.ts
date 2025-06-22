import { Schema, model, Document, Types } from 'mongoose';

export interface iScan extends Document {
    stocked_by: Types.ObjectId,
    stocked_at: Date,
    taken_by: Types.ObjectId,
    taken_at: Date,
    id_item: Types.ObjectId,
    in_time: Date,
    out_time: Date,
    isOut: boolean,
}

const scanSchema = new Schema<iScan>({
    stocked_by: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    stocked_at: { type: Date, default: Date.now, required: true },
    taken_by: { type: Schema.Types.ObjectId, ref: 'Users' },
    taken_at: { type: Date },
    id_item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    isOut: { type: Boolean, default: false, required: true },
}, {
    timestamps: { createdAt: 'in_time', updatedAt: 'out_time' }
});

const Scan = model<iScan>('Scans', scanSchema);

export default Scan;