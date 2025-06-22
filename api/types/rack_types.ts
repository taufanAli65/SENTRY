import { Types } from 'mongoose';

export interface RackResult {
    id: string;
    item_code: string;
    weight: number;
    isOut: boolean;
    time: Date;
}