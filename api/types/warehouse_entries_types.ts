import { Types } from "mongoose";


export interface WarehouseEntryResult {
    id_user: Types.ObjectId | string;
    entry_time: Date;
    face_recognition: string; // URL or path to the face recognition image
}
export interface WarehouseEntryCreate {
    id_user: string;
    entry_time?: Date; // Optional, defaults to current time
    face_recognition: string; // URL or path to the face recognition image
}