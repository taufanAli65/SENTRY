import { Schema, model, Document, Types } from 'mongoose';

export interface iItemStock extends Document {
    id_item: Types.ObjectId,
    weight: number,
    stock: number
}

const itemStockSchema = new Schema({
    id_item: {type: Schema.Types.ObjectId, ref: 'Items', required: true},
    weight: {type: Number, required: true},
    stock: {type: Number, required: true},
});

const ItemStock = model<iItemStock>('ItemStocks', itemStockSchema);

export default ItemStock;