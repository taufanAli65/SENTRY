import { Schema, model } from 'mongoose';

export interface iItem extends Document {
    name: string,
    weight: number
}

const itemSchema = new Schema({
    name: {type: String, required: true},
    weight: {type: Number, required: true},
})

const Item = model<iItem>('Items', itemSchema);

export default Item;