import PlatformStat from "../models/PlatformStat.js";
import Contest from "../models/Contest.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";


let contestCache = {
  data: null,
  expiry: 0
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getDashboardData = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const user = req.user;
  const now = Date.now();

  // Parallel fetch dashboard data
  const fetchTasks = [
    PlatformStat.find({ userId }).select("platform username data stats lastUpdated lastManualRefresh").lean()
  ];

  // Add contest fetch if cache expired
  const useCache = contestCache.data && contestCache.expiry > now;
  if (!useCache) {
    fetchTasks.push(
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
    );
  }

  const results = await Promise.all(fetchTasks);
  const platformStats = results[0];
  
  if (!useCache) {
    contestCache.data = results[1];
    contestCache.expiry = now + CACHE_TTL;
  }
  const upcomingContests = contestCache.data;

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


 // Calculate summary statistics from platform stats

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


