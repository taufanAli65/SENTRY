import { Types } from 'mongoose';

export interface RackResult {
    id: string;
    id_item: Types.ObjectId | string;
    weight: number;
    isOut: boolean;
    time: Date;
}