import { contestService } from "../services/contestService.js";

/**
 * Fetch contests from all platforms (runs hourly)
 */
export async function fetchContests() {
  const startTime = Date.now();

  try {
    const results = await contestService.fetchAllContests();

    return {
      success: true,
      platforms: results,
      totalFetched: Object.values(results).reduce((sum, r) => sum + (r.fetched || 0), 0),
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

export default fetchContests;
