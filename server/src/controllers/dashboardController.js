import PlatformStat from "../models/PlatformStat.js";
import Contest from "../models/Contest.js";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

/**
 * Dashboard Controller - Combined endpoint for dashboard data
 * Reduces multiple API calls to a single request
 */
export const getDashboardData = catchAsync(async (req, res) => {
  const userId = req.user.id;

  // Parallel fetch all dashboard data
  const [user, platformStats, upcomingContests] = await Promise.all([
    User.findById(userId).select("name email profile publicProfile cooldowns").lean(),
    PlatformStat.find({ userId }).select("platform username data stats lastUpdated lastManualRefresh").lean(),
    Contest.find({
      startTime: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
      .sort({ startTime: 1 })
      .limit(10)
      .select("platform name startTime duration url division")
      .lean()
  ]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Calculate summary stats
  const summary = calculateSummary(platformStats);

  const platforms = platformStats.map(stat => {
    const cooldown = user.cooldowns?.[stat.platform];
    const now = new Date();
    const isAvailable = !cooldown?.nextAvailable || new Date(cooldown.nextAvailable) <= now;

    return {
      platform: stat.platform,
      username: stat.username,
      stats: stat.stats,
      data: stat.data,
      lastUpdated: stat.lastUpdated,
      lastManualRefresh: stat.lastManualRefresh,
      canRefresh: isAvailable,
      nextRefreshAvailable: isAvailable ? null : cooldown.nextAvailable
    };
  });

  const dashboardData = {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.profile?.avatar,
      publicProfile: user.publicProfile
    },
    summary,
    platforms,
    upcomingContests: upcomingContests.map(contest => ({
      id: contest._id,
      platform: contest.platform,
      name: contest.name,
      startTime: contest.startTime,
      duration: contest.duration,
      url: contest.url,
      division: contest.division
    }))
  };

  res.status(200).json(new ApiResponse(200, dashboardData, "Dashboard data fetched successfully"));
});

/**
 * Calculate summary statistics from platform stats
 */
function calculateSummary(platformStats) {
  const summary = {
    totalPlatforms: platformStats.length,
    linkedPlatforms: [],
    totalProblemsSolved: 0,
    highlights: []
  };

  for (const stat of platformStats) {
    summary.linkedPlatforms.push(stat.platform);
    const data = stat.data || {};

    const solved = data.totalSolved || data.problemsSolved || data.acCount || 0;
    summary.totalProblemsSolved += solved;

    switch (stat.platform) {
      case "leetcode":
        if (solved >= 100) {
          summary.highlights.push({
            platform: "leetcode",
            type: "milestone",
            message: `${solved} LeetCode problems solved`
          });
        }
        break;

      case "codeforces":
        const cfRating = (data.rating || data.stats?.rating) || 0;
        if (cfRating >= 1200) {
          summary.highlights.push({
            platform: "codeforces",
            type: "rating",
            message: `${data.rank || "Rated"} on Codeforces (${cfRating})`
          });
        }
        break;

      case "github":
        const stars = data.totalStars || 0;
        if (stars >= 10) {
          summary.highlights.push({
            platform: "github",
            type: "stars",
            message: `${stars} GitHub stars across ${data.publicRepos || 0} repos`
          });
        }
        break;
    }
  }

  return summary;
}


