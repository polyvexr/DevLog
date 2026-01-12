import Insight from "../models/Insight.js";
import PlatformStatHistory from "../models/PlatformStatHistory.js";
import PlatformStat from "../models/PlatformStat.js";
import User from "../models/User.js";

/**
 * Insight Service - Rule-based insights generation
 */
export const insightService = {
  /**
   * Get insights for a user
   */
  async getUserInsights(userId, options = {}) {
    const { limit = 20, includeRead = false, includeDismissed = false } = options;

    const query = { userId };
    
    if (!includeRead) {
      query.read = false;
    }
    if (!includeDismissed) {
      query.dismissed = false;
    }

    // Exclude expired insights
    query.$or = [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ];

    return Insight.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit);
  },

  /**
   * Mark insight as read
   */
  async markAsRead(insightId, userId) {
    return Insight.findOneAndUpdate(
      { _id: insightId, userId },
      { read: true },
      { new: true }
    );
  },

  /**
   * Dismiss an insight
   */
  async dismissInsight(insightId, userId) {
    return Insight.findOneAndUpdate(
      { _id: insightId, userId },
      { dismissed: true, read: true },
      { new: true }
    );
  },

  /**
   * Generate insights for a user
   */
  async generateInsightsForUser(userId) {
    const results = {
      generated: 0,
      rules: []
    };

    // Get user's platform stats
    const platformStats = await PlatformStat.find({ userId });
    
    // Get last 30 days of history
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const history = await PlatformStatHistory.find({
      userId,
      snapshotDate: { $gte: thirtyDaysAgo }
    }).sort({ snapshotDate: 1 });

    // Run insight rules
    for (const rule of this.insightRules) {
      try {
        const insight = await rule.check({ userId, platformStats, history });
        if (insight) {
          // Check if similar insight exists recently
          const existingInsight = await Insight.findOne({
            userId,
            type: insight.type,
            platform: insight.platform,
            dismissed: false,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 7 days
          });

          if (!existingInsight) {
            await Insight.create({
              userId,
              ...insight,
              createdAt: new Date()
            });
            results.generated++;
            results.rules.push(rule.name);
          }
        }
      } catch (error) {
        console.error(`Insight rule ${rule.name} failed:`, error.message);
      }
    }

    // Update user's lastInsightDate
    await User.updateOne({ _id: userId }, { lastInsightDate: new Date() });

    return results;
  },

  /**
   * Generate insights for all users (cron batch)
   */
  async generateInsightsBatch(options = {}) {
    const { batchSize = 100, cursor = null } = options;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Find users who haven't had insights generated today
    const query = {
      $or: [
        { lastInsightDate: { $lt: today } },
        { lastInsightDate: null }
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
      totalInsights: 0,
      errors: [],
      lastCursor: null
    };

    for (const user of users) {
      try {
        const insightResult = await this.generateInsightsForUser(user._id);
        results.totalInsights += insightResult.generated;
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
   * Insight rules definition
   */
  insightRules: [
    {
      name: "rating_stagnant",
      check: async ({ platformStats, history }) => {
        const cfStat = platformStats.find(s => s.platform === "codeforces");
        if (!cfStat) return null;

        const cfHistory = history.filter(h => h.platform === "codeforces");
        if (cfHistory.length < 14) return null;

        // Check if rating unchanged for 30 days
        const firstRating = cfHistory[0]?.metrics?.rating;
        const lastRating = cfHistory[cfHistory.length - 1]?.metrics?.rating;

        if (firstRating && lastRating && firstRating === lastRating) {
          return {
            type: "rating_stagnant",
            platform: "codeforces",
            title: "Rating Plateau Detected",
            message: `Your Codeforces rating has been ${lastRating} for the past 30 days. Consider trying harder problems or different topics.`,
            data: { rating: lastRating, days: 30 },
            priority: "medium"
          };
        }
        return null;
      }
    },
    {
      name: "topic_strength",
      check: async ({ platformStats }) => {
        const lcStat = platformStats.find(s => s.platform === "leetcode");
        if (!lcStat?.data?.tagStats) return null;

        const tags = lcStat.data.tagStats;
        const strongTopics = tags.filter(t => t.problemsSolved > 20);
        
        if (strongTopics.length > 0) {
          const topTopic = strongTopics.sort((a, b) => b.problemsSolved - a.problemsSolved)[0];
          return {
            type: "topic_strength",
            platform: "leetcode",
            title: "Strong Topic Identified",
            message: `You're excelling at ${topTopic.tagName} with ${topTopic.problemsSolved} problems solved!`,
            data: { topic: topTopic.tagName, count: topTopic.problemsSolved },
            priority: "low"
          };
        }
        return null;
      }
    },
    {
      name: "activity_drop",
      check: async ({ platformStats, history }) => {
        const ghStat = platformStats.find(s => s.platform === "github");
        if (!ghStat) return null;

        const ghHistory = history.filter(h => h.platform === "github");
        if (ghHistory.length < 14) return null;

        // Compare last week vs previous week
        const mid = Math.floor(ghHistory.length / 2);
        const prevContributions = ghHistory.slice(0, mid).reduce((sum, h) => 
          sum + (h.metrics?.contributions || 0), 0);
        const recentContributions = ghHistory.slice(mid).reduce((sum, h) => 
          sum + (h.metrics?.contributions || 0), 0);

        if (prevContributions > 0 && recentContributions < prevContributions * 0.5) {
          return {
            type: "activity_drop",
            platform: "github",
            title: "Activity Drop Noticed",
            message: "Your GitHub activity dropped by more than 50% compared to the previous week. Keep the momentum going!",
            data: { 
              previous: prevContributions, 
              recent: recentContributions 
            },
            priority: "medium"
          };
        }
        return null;
      }
    },
    {
      name: "streak_alert",
      check: async ({ platformStats }) => {
        const lcStat = platformStats.find(s => s.platform === "leetcode");
        if (!lcStat?.data?.streakData) return null;

        const streak = lcStat.data.streakData;
        
        // Alert if streak was broken recently (had streak > 7, now 0)
        if (streak.currentStreak === 0 && streak.maxStreak > 7) {
          return {
            type: "streak_alert",
            platform: "leetcode",
            title: "Streak Broken!",
            message: `Your ${streak.maxStreak}-day LeetCode streak was broken. Start a new streak today!`,
            data: { 
              maxStreak: streak.maxStreak 
            },
            priority: "high",
            expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
          };
        }
        return null;
      }
    },
    {
      name: "milestone_reached",
      check: async ({ platformStats, history }) => {
        const lcStat = platformStats.find(s => s.platform === "leetcode");
        if (!lcStat) return null;

        const totalSolved = lcStat.data?.totalSolved || 0;
        const milestones = [50, 100, 200, 300, 500, 750, 1000];

        for (const milestone of milestones) {
          if (totalSolved >= milestone) {
            // Check if this milestone was just reached (wasn't in last snapshot)
            const lcHistory = history.filter(h => h.platform === "leetcode");
            if (lcHistory.length > 0) {
              const prevSolved = lcHistory[lcHistory.length - 1]?.metrics?.totalSolved || 0;
              if (prevSolved < milestone && totalSolved >= milestone) {
                return {
                  type: "milestone_reached",
                  platform: "leetcode",
                  title: "Milestone Achieved! 🎉",
                  message: `Congratulations! You've solved ${milestone} LeetCode problems!`,
                  data: { milestone, totalSolved },
                  priority: "high",
                  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                };
              }
            }
          }
        }
        return null;
      }
    }
  ]
};

export default insightService;
