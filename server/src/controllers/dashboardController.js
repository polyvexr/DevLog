import PlatformStat from "../models/PlatformStat.js";
import Contest from "../models/Contest.js";

/**
 * Dashboard Controller - Combined endpoint for dashboard data
 * Reduces multiple API calls to a single request
 */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Parallel fetch all dashboard data
    const [platformStats, upcomingContests] = await Promise.all([
      // Get all platform stats with summary
      PlatformStat.find({ userId }).select("platform username data stats lastUpdated lastManualRefresh"),

      // Get upcoming contests (next 7 days)
      Contest.find({
        startTime: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      })
        .sort({ startTime: 1 })
        .limit(10)
        .select("platform name startTime duration url division")
    ]);

    // Calculate summary stats
    const summary = calculateSummary(platformStats);

    res.json({
      success: true,
      data: {
        summary,
        platforms: platformStats.map(stat => ({
          platform: stat.platform,
          username: stat.username,
          stats: stat.stats,
          data: stat.data,
          lastUpdated: stat.lastUpdated,
          lastManualRefresh: stat.lastManualRefresh,
          progress: calculateProgress(stat.platform, stat.data),
          canRefresh: canRefresh(stat.lastManualRefresh),
          nextRefreshAvailable: getNextRefreshTime(stat.lastManualRefresh)
        })),
        upcomingContests: upcomingContests.map(contest => ({
          id: contest._id,
          platform: contest.platform,
          name: contest.name,
          startTime: contest.startTime,
          duration: contest.duration,
          url: contest.url,
          division: contest.division
        }))
      }
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message
    });
  }
};

/**
 * Calculate summary statistics from platform stats
 */
function calculateSummary(platformStats) {
  const summary = {
    totalPlatforms: platformStats.length,
    linkedPlatforms: [],
    totalProblemsSolved: 0,
    averageProgress: 0,
    highlights: []
  };

  let totalProgress = 0;

  for (const stat of platformStats) {
    summary.linkedPlatforms.push(stat.platform);

    const data = stat.data || {};
    const progress = calculateProgress(stat.platform, data);
    totalProgress += progress;

    switch (stat.platform) {
      case "leetcode":
        const lcSolved = data.totalSolved || 0;
        summary.totalProblemsSolved += lcSolved;
        if (lcSolved >= 100) {
          summary.highlights.push({
            platform: "leetcode",
            type: "milestone",
            message: `${lcSolved} LeetCode problems solved`
          });
        }
        break;

      case "codeforces":
        const cfRating = data.rating || 0;
        const cfSolved = data.problemsSolved || 0;
        summary.totalProblemsSolved += cfSolved;
        if (cfRating >= 1200) {
          summary.highlights.push({
            platform: "codeforces",
            type: "rating",
            message: `${data.rank || "Rated"} on Codeforces (${cfRating})`
          });
        }
        break;

      case "github":
        const repos = data.publicRepos || 0;
        const stars = data.totalStars || 0;
        if (stars >= 10) {
          summary.highlights.push({
            platform: "github",
            type: "stars",
            message: `${stars} GitHub stars across ${repos} repos`
          });
        }
        break;

      case "codechef":
        const ccSolved = data.totalSolved || 0;
        summary.totalProblemsSolved += ccSolved;
        break;

      case "atcoder":
        const atSolved = data.totalSolved || data.acCount || 0;
        summary.totalProblemsSolved += atSolved;
        break;
    }
  }

  summary.averageProgress = platformStats.length > 0
    ? Math.round(totalProgress / platformStats.length)
    : 0;

  return summary;
}

/**
 * Calculate progress percentage for a platform
 */
function calculateProgress(platform, data) {
  if (!data) return 0;

  switch (platform) {
    case "leetcode":
      const lcSolved = data.totalSolved || 0;
      return Math.min(Math.round((lcSolved / 500) * 100), 100);

    case "codeforces":
      const cfRating = data.rating || 0;
      return Math.min(Math.round((cfRating / 2400) * 100), 100);

    case "github":
      const repos = data.publicRepos || 0;
      const stars = data.totalStars || 0;
      const contributions = data.contributions || 0;
      const ghScore = (repos * 5) + (stars * 2) + Math.min(contributions, 500);
      return Math.min(Math.round((ghScore / 500) * 100), 100);

    case "codechef":
      const ccRating = data.rating || 0;
      return Math.min(Math.round((ccRating / 2500) * 100), 100);

    case "atcoder":
      const atRating = data.rating || 0;
      return Math.min(Math.round((atRating / 2800) * 100), 100);

    default:
      return 0;
  }
}

/**
 * Check if manual refresh is available (2-hour cooldown)
 */
function canRefresh(lastManualRefresh) {
  if (!lastManualRefresh) return true;
  const cooldownMs = 2 * 60 * 60 * 1000; // 2 hours
  return Date.now() - new Date(lastManualRefresh).getTime() > cooldownMs;
}

/**
 * Get the next available refresh time
 */
function getNextRefreshTime(lastManualRefresh) {
  if (!lastManualRefresh) return null;
  const cooldownMs = 2 * 60 * 60 * 1000; // 2 hours
  const nextTime = new Date(lastManualRefresh).getTime() + cooldownMs;
  return nextTime > Date.now() ? new Date(nextTime).toISOString() : null;
}

export default { getDashboardData };
