import { Schema, model } from 'mongoose';

export interface IWarehouseEntry {
    id_user: string;
    entry_time: Date;
    face_recognition: string; // URL or path to the face recognition image
}

const warehouseEntrySchema = new Schema<IWarehouseEntry>({
    id_user: { type: String, required: true },
    entry_time: { type: Date, default: Date.now, required: true },
    face_recognition: { type: String, required: true }
}, {
    timestamps: true
});
const WarehouseEntry = model<IWarehouseEntry>('WarehouseEntries', warehouseEntrySchema);
export default WarehouseEntry;