import PlatformStatHistory from "../models/PlatformStatHistory.js";
import PlatformStat from "../models/PlatformStat.js";
import User from "../models/User.js";

/**
 * History Service - Historical snapshot management
 */
export const historyService = {
  /**
   * Get history for a platform with date range
   */
  async getHistory(userId, platform, options = {}) {
    const { days = 30, limit = 100 } = options;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setUTCHours(0, 0, 0, 0);

    const history = await PlatformStatHistory.find({
      userId,
      platform,
      snapshotDate: { $gte: startDate }
    })
      .sort({ snapshotDate: 1 })
      .limit(limit)
      .select("snapshotDate metrics createdAt");

    return history;
  },

  /**
   * Get progress comparison between two periods
   */
  async getProgressComparison(userId, platform, period = "week") {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);

    let periodDays;
    switch (period) {
      case "week":
        periodDays = 7;
        break;
      case "month":
        periodDays = 30;
        break;
      case "quarter":
        periodDays = 90;
        break;
      default:
        periodDays = 7;
    }

    const periodStart = new Date(now);
    periodStart.setDate(periodStart.getDate() - periodDays);

    const previousPeriodStart = new Date(periodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays);

    // Get current and previous period snapshots
    const [currentStart, currentEnd, previousStart] = await Promise.all([
      PlatformStatHistory.findOne({
        userId,
        platform,
        snapshotDate: { $gte: periodStart }
      }).sort({ snapshotDate: 1 }),
      
      PlatformStatHistory.findOne({
        userId,
        platform,
        snapshotDate: { $lte: now }
      }).sort({ snapshotDate: -1 }),
      
      PlatformStatHistory.findOne({
        userId,
        platform,
        snapshotDate: { $gte: previousPeriodStart, $lt: periodStart }
      }).sort({ snapshotDate: 1 })
    ]);

    return {
      period,
      periodDays,
      current: {
        start: currentStart?.metrics || null,
        end: currentEnd?.metrics || null,
        startDate: currentStart?.snapshotDate || null,
        endDate: currentEnd?.snapshotDate || null
      },
      previous: {
        start: previousStart?.metrics || null,
        startDate: previousStart?.snapshotDate || null
      },
      growth: this.calculateGrowth(platform, currentStart?.metrics, currentEnd?.metrics)
    };
  },

  /**
   * Calculate growth metrics between two snapshots
   */
  calculateGrowth(platform, startMetrics, endMetrics) {
    if (!startMetrics || !endMetrics) return null;

    switch (platform) {
      case "leetcode":
        return {
          totalSolved: (endMetrics.totalSolved || 0) - (startMetrics.totalSolved || 0),
          easySolved: (endMetrics.easySolved || 0) - (startMetrics.easySolved || 0),
          mediumSolved: (endMetrics.mediumSolved || 0) - (startMetrics.mediumSolved || 0),
          hardSolved: (endMetrics.hardSolved || 0) - (startMetrics.hardSolved || 0)
        };
      case "codeforces":
        return {
          rating: (endMetrics.rating || 0) - (startMetrics.rating || 0),
          problemsSolved: (endMetrics.problemsSolved || 0) - (startMetrics.problemsSolved || 0)
        };
      case "github":
        return {
          totalRepos: (endMetrics.totalRepos || 0) - (startMetrics.totalRepos || 0),
          totalStars: (endMetrics.totalStars || 0) - (startMetrics.totalStars || 0),
          contributions: (endMetrics.contributions || 0) - (startMetrics.contributions || 0)
        };
      case "codechef":
        return {
          rating: (endMetrics.rating || 0) - (startMetrics.rating || 0),
          totalSolved: (endMetrics.totalSolved || 0) - (startMetrics.totalSolved || 0),
          stars: (endMetrics.stars || 0) - (startMetrics.stars || 0),
          globalRank: (startMetrics.globalRank || 0) - (endMetrics.globalRank || 0) // Lower is better
        };
      case "atcoder":
        return {
          rating: (endMetrics.rating || 0) - (startMetrics.rating || 0),
          totalSolved: (endMetrics.totalSolved || 0) - (startMetrics.totalSolved || 0),
          contestsParticipated: (endMetrics.contestsParticipated || 0) - (startMetrics.contestsParticipated || 0)
        };
      default:
        return null;
    }
  },

  /**
   * Create daily snapshots for all users (cron job)
   */
  async createDailySnapshots(options = {}) {
    const { batchSize = 50, cursor = null } = options;
    
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Find users who haven't had a snapshot today
    const query = {
      $or: [
        { lastSnapshotDate: { $lt: today } },
        { lastSnapshotDate: null }
      ]
    };

    if (cursor) {
      query._id = { $gt: cursor };
    }

    const users = await User.find(query)
      .sort({ _id: 1 })
      .limit(batchSize)
      .select("_id");

    const results = {
      processed: 0,
      created: 0,
      errors: [],
      lastCursor: null
    };

    for (const user of users) {
      try {
        // Get all linked platforms for this user
        const platformStats = await PlatformStat.find({ userId: user._id });

        for (const stat of platformStats) {
          const metrics = this.extractMetrics(stat.platform, stat);

          await PlatformStatHistory.findOneAndUpdate(
            { userId: user._id, platform: stat.platform, snapshotDate: today },
            {
              $set: {
                statsSnapshot: stat.data,
                metrics,
                createdAt: new Date()
              }
            },
            { upsert: true }
          );

          results.created++;
        }

        // Update user's lastSnapshotDate
        await User.updateOne({ _id: user._id }, { lastSnapshotDate: today });
        results.processed++;
        results.lastCursor = user._id;
      } catch (error) {
        results.errors.push({ userId: user._id, error: error.message });
      }
    }

    return {
      ...results,
      hasMore: users.length === batchSize
    };
  },

  /**
   * Extract metrics helper
   */
  extractMetrics(platform, platformStat) {
    const data = platformStat.data || {};
    
    switch (platform) {
      case "leetcode":
        return {
          totalSolved: data.totalSolved || null,
          easySolved: data.submissionsByDifficulty?.easy?.solved || null,
          mediumSolved: data.submissionsByDifficulty?.medium?.solved || null,
          hardSolved: data.submissionsByDifficulty?.hard?.solved || null
        };
      case "codeforces":
        return {
          rating: data.rating || null,
          maxRating: data.maxRating || null,
          problemsSolved: data.problemsSolved || null
        };
      case "github":
        return {
          totalRepos: data.publicRepos || null,
          totalStars: data.totalStars || null,
          contributions: data.contributions || null
        };
      case "codechef":
        return {
          rating: data.rating || null,
          highestRating: data.highestRating || null,
          totalSolved: data.totalSolved || null,
          stars: data.stars || null,
          globalRank: data.globalRank || null,
          countryRank: data.countryRank || null
        };
      case "atcoder":
        return {
          rating: data.rating || null,
          highestRating: data.highestRating || null,
          totalSolved: data.totalSolved || data.acCount || null,
          acCount: data.acCount || null,
          contestsParticipated: data.contestsParticipated || null,
          averagePerformance: data.averagePerformance || null
        };
      default:
        return {};
    }
  }
};

export default historyService;
