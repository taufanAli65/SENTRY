import WarehouseEntry from '../models/warehouse_entries';
import { WarehouseEntryResult, WarehouseEntryCreate } from '../types/warehouse_entries_types';
import { AppError } from '../utils/app_error';

async function addWarehouseEntryService(data: WarehouseEntryCreate): Promise<WarehouseEntryResult> {
    const entry = new WarehouseEntry({
        id_user: data.id_user,
        entry_time: data.entry_time ?? new Date(),
        face_recognition: data.face_recognition,
    });
    await entry.save();
    return {
        id_user: entry.id_user,
        entry_time: entry.entry_time,
        face_recognition: entry.face_recognition,
    };
}

async function getWarehouseEntriesService(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const entriesData = await WarehouseEntry.find().skip(skip).limit(limit);
    const total = await WarehouseEntry.countDocuments();
    return {
        entries: entriesData,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}

async function getWarehouseEntryService(id: string): Promise<WarehouseEntryResult> {
    const entry = await WarehouseEntry.findById(id);
    if (!entry) {
        throw AppError("Warehouse entry not found", 404);
    }
    return {
        id_user: entry.id_user,
        entry_time: entry.entry_time,
        face_recognition: entry.face_recognition,
    };
}

export {
    addWarehouseEntryService,
    getWarehouseEntriesService,
    getWarehouseEntryService
};
