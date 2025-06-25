import mongoose, { Document } from "mongoose";

export interface ICounter extends Document {
  name: string;
  seq: number;
}

const CounterSchema = new mongoose.Schema<ICounter>({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export default mongoose.model<ICounter>("Counter", CounterSchema);
