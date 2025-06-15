import Counter from "../models/counter";
import Item, { IItem } from "../models/item";

export async function getNextItemCode(): Promise<string> {
  const counter = await Counter.findOneAndUpdate(
    { name: "item_code" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const code = counter.seq.toString().padStart(3, "0");
  return `SNTRY${code}`;
}

export async function getAllItems(
  page: number,
  limit: number,
  search?: string
): Promise<{ items: IItem[]; total: number; page: number; limit: number }> {
  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { item_code: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Item.countDocuments(query);
  const items = await Item.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  return { items, total, page, limit };
}

export async function getItemById(id: string): Promise<IItem | null> {
  return Item.findById(id);
}

export async function deleteItemById(id: string): Promise<IItem | null> {
  return Item.findByIdAndDelete(id);
}
