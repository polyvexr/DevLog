import { historyService } from "../services/historyService.js";

/**
 * Create daily snapshots for all users (runs daily at 00:00 UTC)
 * Uses cursor-based batching to handle large user counts
 */
export async function createSnapshots(options = {}) {
  const { cursor = null } = options;
  const startTime = Date.now();

  try {
    const result = await historyService.createDailySnapshots({
      batchSize: 50,
      cursor
    });

    return {
      success: true,
      ...result,
      executionMs: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      executionMs: Date.now() - startTime
    };
  }
}

export default createSnapshots;
