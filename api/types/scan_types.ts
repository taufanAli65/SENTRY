import { Types } from 'mongoose';

export interface ScanResult {
    id: string;
    stocked_by: Types.ObjectId | string;
    stocked_at: Date;
    taken_by: Types.ObjectId | string;
    taken_at: Date;
    id_item: Types.ObjectId | string;
    in_time: Date;
    out_time: Date;
    isOut: boolean;
}
