import RackRealtimes from '../models/rack_realtimes';
import Scans from '../models/scans';
import WarehouseEntry from '../models/warehouse_entries';

/**
 * Detects suspected item theft by checking for significant weight discrepancies
 * between the rack and item stocks. If a discrepancy is found, attempts to
 * identify the closest warehouse entry user as a suspect.
 */
export async function checkWeightDiscrepancy(threshold: number): Promise<string | null> {
    // Get the latest data when the weight sensor was last updated
    const rackRealtimes = await RackRealtimes.findOne().sort({ time: -1 });
    if (!rackRealtimes) return "No rack realtime data available.";

    // get the last scan of item stock
    const lastScan = await Scans.findOne().sort({ out_time: -1 });
    if (!lastScan) return "No recent item scan data available.";

    // Compare if rackRealtimes.time is similar to lastScan.time (within 1 second)
    const rackTime = new Date(rackRealtimes.time).getTime();
    const scanTime = new Date(lastScan.out_time).getTime();
    const timeDiff = Math.abs(rackTime - scanTime);

    if (timeDiff > threshold) {
        const userId = await findClosestWarehouseEntryUser(rackRealtimes.time);
        if (userId) {
            return `Warning: The latest rack sensor update (${rackRealtimes.time}) and the most recent item scan (${lastScan.out_time}) are not synchronized. Closest warehouse entry user (potentially relevant): ${userId}.`;
        } else {
            return `Alert: Rack sensor and item scan times are not synchronized, and no related warehouse entry user could be identified.`;
        }
    } else {
        // No significant discrepancy, but still find closest user for logging
        const userId = await findClosestWarehouseEntryUser(rackRealtimes.time);
        if (userId) {
            return `Rack and item scan times are synchronized. Closest warehouse entry user: ${userId}.`;
        } else {
            return `Rack and item scan times are synchronized. No related warehouse entry user found.`;
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
