import Item from '../models/items';
import { itemResult } from '../types/item_types';
import { AppError } from '../utils/app_error';


async function addItemService(name: string, weight: number): Promise<itemResult> {
    if(!name || !weight) {
        throw AppError("Name and weight are required!", 400);
    }
    const item = new Item({
        name,
        weight,
    });
    await item.save();
    return {id: item._id.toString(), name: item.name, weight: Number(item.weight)};
}

async function getItemsService() {
    const itemsData = await Item.find();
    return itemsData;
}

async function getItemService(id: string): Promise<itemResult> {
    if(!id) {
        throw AppError("Id is required", 400);
    }
    const itemData = await Item.findOne({ _id: id });
    if(!itemData) {
        throw AppError("Item not found", 404)
    }
    return {id: itemData._id.toString(), name: itemData.name, weight: Number(itemData.weight)};
}

export { addItemService, getItemsService, getItemService };