import RackRealtime from '../models/rack_realtimes';
import ItemStock from '../models/item_stocks';
import WarehouseEntry from '../models/warehouse_entries';

/**
 * Detects suspected item theft by checking for significant weight discrepancies
 * between the rack and item stocks. If a discrepancy is found, attempts to
 * identify the closest warehouse entry user as a suspect.
 */
export async function checkWeightDiscrepancy(threshold: number): Promise<string | null> {
    // Get the latest rack realtime weight
    const rackRealtime = await RackRealtime.findOne().sort({ time: -1 });
    if (!rackRealtime) return "No rack realtime data found.";

    // Sum all item stocks' weights
    const itemStocks = await ItemStock.find();
    const totalItemStockWeight = itemStocks.reduce((sum, stock) => sum + (stock.weight || 0), 0);

    // Compare
    const diff = Math.abs(rackRealtime.weight - totalItemStockWeight);
    if (diff > threshold) {
        // Significant discrepancy detected, try to find suspect user
        const userId = await findClosestWarehouseEntryUser(rackRealtime.time);
        if (userId) {
            return `Suspected item theft: Rack weight (${rackRealtime.weight}) and ItemStock weight (${totalItemStockWeight}) differ by ${diff}, exceeding threshold (${threshold}). Closest warehouse entry user (suspect): ${userId}.`;
        } else {
            return `Suspected item theft: Rack weight (${rackRealtime.weight}) and ItemStock weight (${totalItemStockWeight}) differ by ${diff}, exceeding threshold (${threshold}). No warehouse entry user found.`;
        }
    } else {
        // No significant discrepancy, but still find closest user for logging
        const userId = await findClosestWarehouseEntryUser(rackRealtime.time);
        if (userId) {
            return `No significant discrepancy detected (diff: ${diff} < threshold: ${threshold}). Closest warehouse entry user: ${userId}.`;
        } else {
            return `No significant discrepancy detected (diff: ${diff} < threshold: ${threshold}). No warehouse entry user found.`;
        }
    }
}

export async function findClosestWarehouseEntryUser(rackTime: Date): Promise<string | null> {
    const entries = await WarehouseEntry.find({}, { entry_time: 1, id_user: 1 }).lean();
    if (!entries.length) return null;

    let closest = entries[0];
    let minDiff = Math.abs(new Date(closest.entry_time).getTime() - rackTime.getTime());

    for (const entry of entries) {
        const diff = Math.abs(new Date(entry.entry_time).getTime() - rackTime.getTime());
        if (diff < minDiff) {
            closest = entry;
            minDiff = diff;
        }
    }
    return closest && closest.id_user ? closest.id_user : null;
}
