import Counter from "../models/counter";

export async function getNextItemCode(): Promise<string> {
  const counter = await Counter.findOneAndUpdate(
    { name: "item_code" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const code = counter.seq.toString().padStart(3, "0");
  return `SNTRY${code}`;
}
