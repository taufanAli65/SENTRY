import Item from '../models/items';
import { itemResult } from '../types/item_types';
import { AppError } from '../utils/app_error';


async function addItemService(name: string, weight: number): Promise<itemResult> {
    const item = new Item({
        name,
        weight,
    });
    await item.save();
    return {id: item._id.toString(), name: item.name, weight: Number(item.weight)};
}

async function getItemsService(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const itemsData = await Item.find().skip(skip).limit(limit);
    const total = await Item.countDocuments();
    return {
        items: itemsData,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}

async function getItemService(id: string): Promise<itemResult> {
    const itemData = await Item.findOne({ _id: id });
    if(!itemData) {
        throw AppError("Item not found", 404);
    }
    return {id: itemData._id.toString(), name: itemData.name, weight: Number(itemData.weight)};
}

async function updateItemService(id: string, name: string, weight: number): Promise<itemResult> {
    const itemData = await Item.findOneAndUpdate(
        { _id: id },
        { name, weight },
        { new: true }
    );
    if (!itemData) {
        throw AppError("Item not found", 404);
    }
    return { id: itemData._id.toString(), name: itemData.name, weight: Number(itemData.weight) };
}

async function deleteItemService(id: string): Promise<itemResult> {
    const itemData = await Item.findOneAndDelete({ _id: id });
    if (!itemData) {
        throw AppError("Item not found", 404);
    }
    return { id: itemData._id.toString(), name: itemData.name, weight: Number(itemData.weight) };
}

export { addItemService, getItemsService, getItemService, updateItemService, deleteItemService };