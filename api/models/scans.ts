import { Schema, model, Document, Types } from 'mongoose';

export interface iScan extends Document {
    id_user: Types.ObjectId,
    id_item: Types.ObjectId,
    in_time: Date,
    out_time: Date,
    isOut: boolean,
}

const scanSchema = new Schema({
    id_user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    id_item: {type: Schema.Types.ObjectId, ref: 'Items', required: true},
    isOut: {type: Boolean, default: false, required: true},
}, {
    timestamps: { createdAt: 'in_time', updatedAt: 'out_time' }
});

const Scan = model<iScan>('Scans', scanSchema);

export default Scan;