import { Types } from 'mongoose';

export interface ScanResult {
    id: string;
    id_user: Types.ObjectId | string;
    id_item: Types.ObjectId | string;
    in_time: Date;
    out_time: Date;
    isOut: boolean;
}
