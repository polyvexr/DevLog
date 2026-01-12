import { historyService } from "../services/historyService.js";

/**
 * History Controller - Historical progress tracking endpoints
 */

/**
 * GET /api/history/:platform
 * Get historical snapshots for a platform
 */
export const getHistory = async (req, res) => {
  try {
    const { platform } = req.params;
    const { days = 30 } = req.query;

    const validPlatforms = ["leetcode", "codeforces", "github"];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: "Invalid platform" });
    }

    const history = await historyService.getHistory(
      req.user._id,
      platform,
      { days: parseInt(days) }
    );

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/history/:platform/progress
 * Get progress comparison for a platform
 */
export const getProgressComparison = async (req, res) => {
  try {
    const { platform } = req.params;
    const { period = "week" } = req.query;

    const validPlatforms = ["leetcode", "codeforces", "github"];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: "Invalid platform" });
    }

    const validPeriods = ["week", "month", "quarter"];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ error: "Invalid period. Use: week, month, quarter" });
    }

    const comparison = await historyService.getProgressComparison(
      req.user._id,
      platform,
      period
    );

    res.json({ success: true, comparison });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
