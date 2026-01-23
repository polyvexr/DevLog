import PlatformStat from "../models/PlatformStat.js";
import SyncJob from "../models/SyncJob.js";
import User from "../models/User.js";
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

    // Create new job or find existing one for today
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

    // If it was already completed today, skip. 
    // BUT! If it failed today, and this is a cron/admin trigger, we allow it to retry (reset to pending)
    if (job.status === "completed") {
      return {
        queued: false,
        message: "Job already completed for today",
        jobId: job._id
      };
    }

    if (job.status === "failed") {
      job.status = "pending";
      job.nextRetryAt = null;
      job.retryCount = 0;
      await job.save();
      return {
        queued: true,
        message: "Retrying previously failed job",
        jobId: job._id
      };
    }

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

      // Only update if we got valid data (align with adminController logic)
      if (freshData && Object.keys(freshData).length > 0 && !freshData.error) {
        // Log a summary of what's being saved to help debug
        const statsSummary = job.platform === "github"
          ? `Public Repos: ${freshData.public_repos}`
          : `Rating: ${freshData.rating || freshData.currentRating || "N/A"}`;

        logger.info(`Updating DB for ${job.platform} (${platformStat.username}): ${statsSummary}`);

        // Use findOneAndUpdate for better atomic updates in serverless
        await PlatformStat.findOneAndUpdate(
          { _id: platformStat._id },
          {
            $set: {
              data: freshData,
              stats: this.extractStats(job.platform, freshData),
              lastUpdated: Date.now()
            }
          }
        );

        // Also update User cooldown to show the latest sync time on the UI
        await User.findOneAndUpdate(
          { _id: job.userId },
          {
            $set: {
              [`cooldowns.${job.platform}.lastRefresh`]: new Date(),
              [`cooldowns.${job.platform}.nextAvailable`]: new Date(Date.now() + (6 * 60 * 60 * 1000))
            }
          }
        );

        logger.info(`Database successfully updated for ${job.platform}`);
      } else {
        const errorMsg = freshData?.error || "Empty data returned";
        logger.warn(`Sync for ${job.platform} skipped: ${errorMsg}`, {
          username: platformStat.username
        });
        throw new Error(errorMsg);
      }

      // Mark job as completed
      job.status = "completed";
      job.completedAt = new Date();
      job.executionDurationMs = Date.now() - startTime;
      await job.save();

      logger.info(`Sync job completed for ${job.platform}`, {
        jobId: job._id,
        userId: job.userId,
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
   * Process multiple sync jobs in parallel (batch processing)
   * @param {array} jobs - Array of sync jobs to process
   * @param {number} concurrency - Max concurrent jobs (default: 5)
   * @returns {object} Batch processing results
   */
  async processBatchSyncJobs(jobs, concurrency = 5) {
    const results = {
      total: jobs.length,
      success: 0,
      failed: 0,
      processed: [],
      startTime: Date.now(),
    };

    // Process in batches with concurrency limit
    for (let i = 0; i < jobs.length; i += concurrency) {
      const batch = jobs.slice(i, i + concurrency);

      const batchResults = await Promise.allSettled(
        batch.map(job => this.processSyncJob(job))
      );

      batchResults.forEach((result, idx) => {
        if (result.status === "fulfilled" && result.value.success) {
          results.success++;
          results.processed.push({
            jobId: batch[idx]._id,
            platform: batch[idx].platform,
            status: "success"
          });
        } else {
          results.failed++;
          results.processed.push({
            jobId: batch[idx]._id,
            platform: batch[idx].platform,
            status: "failed",
            error: result.reason?.message || result.value?.error
          });
        }
      });
    }

    results.duration = Date.now() - results.startTime;

    logger.info("Batch sync completed", {
      total: results.total,
      success: results.success,
      failed: results.failed,
      duration: `${results.duration}ms`
    });

    return results;
  },

  /**
   * Extract normalized stats from raw platform data
   */
  extractStats(platform, data) {
    if (!data || Object.keys(data).length === 0) return {};

    // For now, return the full data as stats to ensure frontend compatibility
    // but we can add platform-specific normalization if needed
    switch (platform) {
      case "leetcode":
      case "codeforces":
      case "github":
      case "codechef":
      case "atcoder":
        return { ...data };
      default:
        return {};
    }
  },

  /**
   * Schedule sync jobs for ALL linked platforms across ALL users
   * Used by the daily cron to populate the queue
   */
  async scheduleGlobalSync() {
    const startTime = Date.now();
    try {
      // Find all linked platform stats
      const platformStats = await PlatformStat.find({}, "userId platform");

      let queued = 0;
      let alreadyQueued = 0;

      // Group by user/platform to avoid unnecessary calls if duplicates exist
      for (const stat of platformStats) {
        const result = await this.enqueueSyncJob(stat.userId, stat.platform, "cron");
        if (result.queued) {
          queued++;
        } else {
          alreadyQueued++;
        }
      }

      logger.info("Global sync scheduling completed", {
        total: platformStats.length,
        queued,
        alreadyQueued,
        duration: Date.now() - startTime
      });

      return { total: platformStats.length, queued, alreadyQueued };
    } catch (error) {
      logger.error("Global sync scheduling failed", { error: error.message });
      throw error;
    }
  }
};

export default platformService;
