import mongoose, { Document } from "mongoose";

export interface IItem extends Document {
  item_code: string;
  name: string;
  weight: number;
  photo_url: string;
  category: string;
}

const ItemSchema = new mongoose.Schema<IItem>({
  item_code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  photo_url: { type: String, required: true },
  category: { type: String, required: true },
});

export default mongoose.model<IItem>("Item", ItemSchema);