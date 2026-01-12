import { insightService } from "../services/insightService.js";

/**
 * Generate insights for all users (runs daily at 06:00 UTC)
 * Uses cursor-based batching for scalability
 */
export async function generateInsights(options = {}) {
  const { cursor = null } = options;
  const startTime = Date.now();

  try {
    const result = await insightService.generateInsightsBatch({
      batchSize: 100,
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

export default generateInsights;
