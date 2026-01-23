import SyncJob from "../models/SyncJob.js";
import { platformService } from "../services/platformService.js";

// Rate limits per platform (per minute)
const RATE_LIMITS = {
  leetcode: { maxPerMinute: 30, delayMs: 2000 },
  codeforces: { maxPerMinute: 30, delayMs: 2000 },
  github: { maxPerMinute: 60, delayMs: 1000 },
  codechef: { maxPerMinute: 15, delayMs: 4000 }, // Slower due to scraping fallback
  atcoder: { maxPerMinute: 20, delayMs: 3000 }
};

/**
 * Process pending sync jobs (runs every 1 minute)
 * Batch processes jobs with rate limiting
 */
export async function processSyncJobs(options = {}) {
  const { batchSize = 10 } = options;
  const startTime = Date.now();

  const results = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  try {
    const now = new Date();

    // 0. Cleanup "Zombie" jobs (stuck in processing for > 5 mins)
    const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const zombies = await SyncJob.updateMany(
      { status: "processing", updatedAt: { $lt: fiveMinsAgo } },
      { $set: { status: "pending", updatedAt: now } }
    );
    if (zombies.modifiedCount > 0) {
      console.log(`Cleaned up ${zombies.modifiedCount} zombie jobs`);
    }

    // Find pending jobs (including retry-ready failed jobs)
    const pendingJobs = await SyncJob.find({
      $or: [
        { status: "pending", nextRetryAt: null },
        { status: "pending", nextRetryAt: { $lte: now } }
      ]
    })
      .sort({ createdAt: 1 })
      .limit(batchSize);

    if (pendingJobs.length === 0) {
      return { ...results, message: "No pending jobs" };
    }

    // Group jobs by platform to respect rate limits
    const jobsByPlatform = {};
    for (const job of pendingJobs) {
      if (!jobsByPlatform[job.platform]) {
        jobsByPlatform[job.platform] = [];
      }
      jobsByPlatform[job.platform].push(job);
    }

    // Process jobs with rate limiting
    for (const [platform, jobs] of Object.entries(jobsByPlatform)) {
      const rateLimit = RATE_LIMITS[platform] || { maxPerMinute: 10, delayMs: 3000 };

      // Check how many calls we've made in the last minute
      const recentCalls = await SyncJob.countDocuments({
        platform,
        status: "completed",
        completedAt: { $gte: new Date(Date.now() - 60000) }
      });

      if (recentCalls >= rateLimit.maxPerMinute) {
        results.skipped += jobs.length;
        continue;
      }

      const allowedCalls = rateLimit.maxPerMinute - recentCalls;
      const jobsToProcess = jobs.slice(0, allowedCalls);

      for (const job of jobsToProcess) {
        try {
          const result = await platformService.processSyncJob(job);

          if (result.success) {
            results.succeeded++;
          } else {
            results.failed++;
            results.errors.push({
              jobId: job._id,
              platform: job.platform,
              error: result.error
            });
          }
          results.processed++;

          // Delay between calls
          await delay(rateLimit.delayMs);
        } catch (error) {
          results.failed++;
          results.errors.push({
            jobId: job._id,
            platform: job.platform,
            error: error.message
          });
        }

        // Time guard: exit 10s before max timeout (e.g. 300s)
        if (Date.now() - startTime > 290000) {
          return {
            ...results,
            message: "Exited early due to timeout guard",
            executionMs: Date.now() - startTime
          };
        }
      }
    }

    return {
      ...results,
      executionMs: Date.now() - startTime
    };
  } catch (error) {
    return {
      ...results,
      error: error.message,
      executionMs: Date.now() - startTime
    };
  }
}

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default processSyncJobs;
