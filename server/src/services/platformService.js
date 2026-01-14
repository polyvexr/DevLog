import PlatformStat from "../models/PlatformStat.js";
import SyncJob from "../models/SyncJob.js";
import User from "../models/User.js";
import PlatformStatHistory from "../models/PlatformStatHistory.js";
import { fetchLeetCode } from "../utils/fetchLeetCode.js";
import { fetchCodeforces } from "../utils/fetchCodeforces.js";
import { fetchGithub } from "../utils/fetchGithub.js";
import { fetchCodeChef } from "../utils/fetchCodeChef.js";
import { fetchAtCoder } from "../utils/fetchAtCoder.js";
import logger from "../utils/logger.js";

// Cooldown duration in milliseconds (6 hours)
const COOLDOWN_MS = 6 * 60 * 60 * 1000;

// Platform fetch function mapping
const platformFetchers = {
  leetcode: fetchLeetCode,
  codeforces: fetchCodeforces,
  github: fetchGithub,
  codechef: fetchCodeChef,
  atcoder: fetchAtCoder,
};

/**
 * Platform Service - Business logic for platform operations
 */
export const platformService = {
  /**
   * Get list of supported platforms
   */
  getSupportedPlatforms() {
    return Object.keys(platformFetchers);
  },

  /**
   * Check if user can refresh a platform (cooldown enforcement)
   */
  async canRefresh(userId, platform) {
    const user = await User.findById(userId).select("cooldowns");
    if (!user) return { allowed: false, error: "User not found" };

    const cooldown = user.cooldowns?.[platform];
    const now = new Date();

    if (cooldown?.nextAvailable && cooldown.nextAvailable > now) {
      return {
        allowed: false,
        nextAvailable: cooldown.nextAvailable,
        remainingMs: cooldown.nextAvailable - now
      };
    }

    return { allowed: true };
  },

  /**
   * Enqueue a sync job (API endpoint handler)
   */
  async enqueueSyncJob(userId, platform, triggeredBy = "user") {
    // Create idempotency key (one job per platform per day per user)
    const today = new Date().toISOString().split("T")[0];
    const idempotencyKey = `${userId}-${platform}-${today}`;

    // Check for existing pending/processing job
    const existingJob = await SyncJob.findOne({
      userId,
      platform,
      status: { $in: ["pending", "processing"] }
    });

    if (existingJob) {
      return { 
        queued: false, 
        message: "Job already in queue",
        jobId: existingJob._id 
      };
    }

    // Create new job
    const job = await SyncJob.findOneAndUpdate(
      { idempotencyKey },
      {
        $setOnInsert: {
          userId,
          platform,
          status: "pending",
          createdAt: new Date(),
          triggeredBy
        }
      },
      { upsert: true, new: true }
    );

    // Update user cooldown
    if (triggeredBy === "user") {
      await User.updateOne(
        { _id: userId },
        {
          [`cooldowns.${platform}.lastRefresh`]: new Date(),
          [`cooldowns.${platform}.nextAvailable`]: new Date(Date.now() + COOLDOWN_MS)
        }
      );
    }

    return { 
      queued: true, 
      jobId: job._id,
      message: "Sync job queued" 
    };
  },

  /**
   * Process a sync job (called by cron handler)
   */
  async processSyncJob(job) {
    const startTime = Date.now();

    try {
      // Mark as processing
      job.status = "processing";
      job.startedAt = new Date();
      await job.save();

      // Get platform stat record
      const platformStat = await PlatformStat.findOne({
        userId: job.userId,
        platform: job.platform
      });

      if (!platformStat) {
        throw new Error(`No linked ${job.platform} account found`);
      }

      // Get fetch function for platform
      const fetchFunction = platformFetchers[job.platform];
      if (!fetchFunction) {
        throw new Error(`Unknown platform: ${job.platform}`);
      }

      // Fetch fresh data from external API
      const freshData = await fetchFunction(platformStat.username);

      // Update platform stat
      platformStat.data = freshData;
      platformStat.stats = this.extractStats(job.platform, freshData);
      platformStat.lastUpdated = new Date();
      platformStat.lastManualRefresh = new Date();
      await platformStat.save();

      // Create history snapshot
      await this.createSnapshot(job.userId, job.platform, platformStat);

      // Mark job as completed
      job.status = "completed";
      job.completedAt = new Date();
      job.executionDurationMs = Date.now() - startTime;
      await job.save();

      logger.info("Sync job completed", {
        jobId: job._id,
        platform: job.platform,
        duration: job.executionDurationMs,
      });

      return { success: true, job };
    } catch (error) {
      // Handle failure with retry logic
      const backoffMs = Math.pow(2, job.retryCount) * 60000; // 1m, 2m, 4m...

      if (job.retryCount >= job.maxRetries) {
        job.status = "failed";
      } else {
        job.status = "pending";
        job.nextRetryAt = new Date(Date.now() + backoffMs);
        job.retryCount++;
      }

      job.lastError = error.message;
      job.executionDurationMs = Date.now() - startTime;
      await job.save();

      logger.error("Sync job failed", {
        jobId: job._id,
        platform: job.platform,
        error: error.message,
        retryCount: job.retryCount,
      });

      return { success: false, error: error.message, job };
    }
  },

  /**
   * Extract normalized stats from raw platform data
   */
  extractStats(platform, data) {
    switch (platform) {
      case "leetcode":
        return {
          totalSolved: data.totalSolved || 0,
          easySolved: data.submissionsByDifficulty?.easy?.solved || 0,
          mediumSolved: data.submissionsByDifficulty?.medium?.solved || 0,
          hardSolved: data.submissionsByDifficulty?.hard?.solved || 0,
          ranking: data.ranking || null,
          rating: data.contestRanking?.rating || null
        };
      case "codeforces":
        return {
          rating: data.rating || 0,
          maxRating: data.maxRating || 0,
          rank: data.rank || "unrated",
          problemsSolved: data.problemsSolved || 0,
          contestsParticipated: data.totalContests || 0
        };
      case "github":
        return {
          publicRepos: data.publicRepos || 0,
          followers: data.followers || 0,
          following: data.following || 0,
          totalStars: data.totalStars || 0,
          totalForks: data.totalForks || 0
        };
      case "codechef":
        return {
          rating: data.rating || 0,
          highestRating: data.highestRating || 0,
          stars: data.stars || 0,
          totalSolved: data.totalSolved || 0,
          globalRank: data.globalRank || null,
          countryRank: data.countryRank || null
        };
      case "atcoder":
        return {
          rating: data.rating || 0,
          highestRating: data.highestRating || 0,
          rankColor: data.rankColor || "gray",
          totalSolved: data.totalSolved || 0,
          contestsParticipated: data.contestsParticipated || 0,
          averagePerformance: data.averagePerformance || 0
        };
      default:
        return {};
    }
  },

  /**
   * Create a history snapshot
   */
  async createSnapshot(userId, platform, platformStat) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const metrics = this.extractMetrics(platform, platformStat);

    await PlatformStatHistory.findOneAndUpdate(
      { userId, platform, snapshotDate: today },
      {
        $set: {
          statsSnapshot: platformStat.data,
          metrics,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
  },

  /**
   * Extract metrics for quick querying
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
          totalSolved: data.totalSolved || null
        };
      case "atcoder":
        return {
          rating: data.rating || null,
          highestRating: data.highestRating || null,
          totalSolved: data.totalSolved || null
        };
      default:
        return {};
    }
  }
};

export default platformService;
