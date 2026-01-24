import { contestService } from "../services/contestService.js";

/**
 * Contest Controller - Contest aggregation endpoints
 */

/**
 * GET /api/contests
 * Get upcoming contests with optional filters
 */
export const getUpcomingContests = async (req, res) => {
  try {
    const { platforms, limit = 50, days = 60 } = req.query;

    let platformFilter = ["leetcode", "codeforces", "codechef", "atcoder"];
    if (platforms) {
      platformFilter = platforms.split(",").filter(p =>
        ["leetcode", "codeforces", "codechef", "atcoder"].includes(p)
      );
    }

    const contests = await contestService.getUpcomingContests({
      platforms: platformFilter,
      limit: parseInt(limit),
      days: parseInt(days)
    });

    res.json({ success: true, contests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/contests/:platform
 * Get contests for a specific platform
 */
export const getContestsByPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    const { limit = 20 } = req.query;

    const validPlatforms = ["leetcode", "codeforces", "codechef", "atcoder"];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: "Invalid platform" });
    }

    const contests = await contestService.getContestsByPlatform(platform, {
      limit: parseInt(limit)
    });

    res.json({ success: true, contests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
