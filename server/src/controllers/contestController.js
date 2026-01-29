import { contestService } from "../services/contestService.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

/**
 * Get upcoming contests with optional filters
 * GET /api/contests
 */
export const getUpcomingContests = catchAsync(async (req, res) => {
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

  res.status(200).json(new ApiResponse(200, { contests }));
});

/**
 * Get contests for a specific platform
 * GET /api/contests/:platform
 */
export const getContestsByPlatform = catchAsync(async (req, res) => {
  const { platform } = req.params;
  const { limit = 20 } = req.query;

  const validPlatforms = ["leetcode", "codeforces", "codechef", "atcoder"];
  if (!validPlatforms.includes(platform)) {
    throw new ApiError(400, "Invalid platform");
  }

  const contests = await contestService.getContestsByPlatform(platform, {
    limit: parseInt(limit)
  });

  res.status(200).json(new ApiResponse(200, { contests }));
});

