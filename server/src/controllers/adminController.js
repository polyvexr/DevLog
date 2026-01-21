import User from "../models/User.js";
import PlatformStat from "../models/PlatformStat.js";
import { fetchLeetCode } from "../utils/fetchLeetCode.js";
import { fetchCodeforces } from "../utils/fetchCodeforces.js";
import { fetchGithub } from "../utils/fetchGithub.js";
import { fetchCodeChef } from "../utils/fetchCodeChef.js";
import { fetchAtCoder } from "../utils/fetchAtCoder.js";
import logger from "../utils/logger.js";

// Platform fetch function mapping
const platformFetchers = {
  leetcode: fetchLeetCode,
  codeforces: fetchCodeforces,
  github: fetchGithub,
  codechef: fetchCodeChef,
  atcoder: fetchAtCoder,
};

// Concurrency configuration
const PARALLEL_CONFIG = {
  maxConcurrentUsers: 5,     // Max users to sync in parallel per platform
  maxConcurrentPlatforms: 5, // Max platforms to sync in parallel
};

/**
 * Sync a single user's platform data
 * @param {object} platformStat - Platform stat document
 * @param {function} fetchFunction - Platform fetch function
 * @returns {object} Sync result
 */
async function syncSingleUser(platformStat, fetchFunction) {
  if (!platformStat.username || !platformStat.userId) {
    return { status: "skipped", reason: "Missing username or userId" };
  }

  try {
    const data = await fetchFunction(platformStat.username);
    
    // Only update if we got valid data
    if (data && Object.keys(data).length > 0) {
      platformStat.data = data;
      platformStat.stats = data;
      platformStat.lastUpdated = Date.now();
      await platformStat.save();
      
      return {
        status: "success",
        user: platformStat.userId.email,
        username: platformStat.username,
      };
    } else {
      return {
        status: "empty",
        user: platformStat.userId?.email || "Unknown",
        username: platformStat.username,
        reason: "No data returned from API",
      };
    }
  } catch (error) {
    return {
      status: "failed",
      user: platformStat.userId?.email || "Unknown",
      username: platformStat.username,
      error: error.message,
    };
  }
}

/**
 * Process items in parallel with concurrency limit
 * @param {array} items - Items to process
 * @param {function} processor - Async function to process each item
 * @param {number} concurrency - Max concurrent operations
 * @returns {array} Results
 */
async function parallelProcess(items, processor, concurrency) {
  const results = [];
  
  // Process in batches
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(processor));
    
    // Extract values from settled promises
    batchResults.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        results.push({ 
          status: "failed", 
          error: result.reason?.message || "Unknown error",
          item: batch[idx]
        });
      }
    });
  }
  
  return results;
}

/**
 * Sync all users for a specific platform (with parallel processing)
 * @param {string} platform - Platform name
 * @returns {object} Sync results
 */
async function syncPlatformStatsParallel(platform) {
  const fetchFunction = platformFetchers[platform];
  
  if (!fetchFunction) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  const startTime = Date.now();
  const platformStats = await PlatformStat.find({ platform }).populate("userId", "email");
  
  const syncResults = {
    platform,
    total: platformStats.length,
    success: 0,
    failed: 0,
    empty: 0,
    skipped: 0,
    details: [],
    duration: 0,
  };

  if (platformStats.length === 0) {
    syncResults.duration = Date.now() - startTime;
    return syncResults;
  }

  // Process users in parallel with concurrency limit
  const results = await parallelProcess(
    platformStats,
    (stat) => syncSingleUser(stat, fetchFunction),
    PARALLEL_CONFIG.maxConcurrentUsers
  );

  // Aggregate results
  results.forEach((result) => {
    if (result.status === "success") {
      syncResults.success++;
    } else if (result.status === "failed") {
      syncResults.failed++;
    } else if (result.status === "empty") {
      syncResults.empty++;
    } else if (result.status === "skipped") {
      syncResults.skipped++;
    }
    syncResults.details.push(result);
  });

  syncResults.duration = Date.now() - startTime;

  logger.info(`Sync completed for ${platform}`, {
    total: syncResults.total,
    success: syncResults.success,
    failed: syncResults.failed,
    duration: `${syncResults.duration}ms`,
  });

  return syncResults;
}

/**
 * Sync all platforms for all users (PARALLEL - all platforms at once)
 */
export const syncAllPlatforms = async (req, res) => {
  try {
    const startTime = Date.now();
    const allPlatforms = Object.keys(platformFetchers);
    
    logger.info("Starting parallel sync for all platforms", { 
      platforms: allPlatforms,
      concurrency: PARALLEL_CONFIG.maxConcurrentPlatforms
    });

    // Sync ALL platforms in parallel using Promise.allSettled
    const platformResults = await Promise.allSettled(
      allPlatforms.map(platform => syncPlatformStatsParallel(platform))
    );

    // Process results
    const results = {};
    platformResults.forEach((result, idx) => {
      const platform = allPlatforms[idx];
      if (result.status === "fulfilled") {
        results[platform] = result.value;
      } else {
        results[platform] = { 
          platform,
          error: result.reason?.message || "Unknown error",
          total: 0,
          success: 0,
          failed: 0
        };
        logger.error(`Sync failed for ${platform}`, { error: result.reason?.message });
      }
    });

    // Calculate totals
    const totals = {
      total: 0,
      success: 0,
      failed: 0,
      empty: 0,
      duration: Date.now() - startTime,
    };

    Object.values(results).forEach((result) => {
      if (result.total) {
        totals.total += result.total;
        totals.success += result.success || 0;
        totals.failed += result.failed || 0;
        totals.empty += result.empty || 0;
      }
    });

    logger.info("Parallel sync completed for all platforms", {
      ...totals,
      durationSeconds: (totals.duration / 1000).toFixed(2)
    });

    res.json({
      success: true,
      message: `Sync completed for all platforms in ${(totals.duration / 1000).toFixed(2)}s`,
      data: {
        totals,
        platforms: results,
      },
    });
  } catch (error) {
    logger.error("Sync all platforms error", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Failed to sync platforms",
    });
  }
};

/**
 * Sync specific platform for all users (with parallel user processing)
 */
export const syncPlatform = async (req, res) => {
  const { platform } = req.params;

  if (!platformFetchers[platform]) {
    return res.status(400).json({
      success: false,
      message: `Unsupported platform: ${platform}. Supported: ${Object.keys(platformFetchers).join(", ")}`,
    });
  }

  try {
    const results = await syncPlatformStatsParallel(platform);

    res.json({
      success: true,
      message: `${platform} sync completed in ${(results.duration / 1000).toFixed(2)}s`,
      data: { results },
    });
  } catch (error) {
    logger.error(`Sync ${platform} error`, { error: error.message });
    res.status(500).json({
      success: false,
      message: `Failed to sync ${platform}`,
    });
  }
};

// Legacy individual platform sync endpoints (for backwards compatibility)
export const syncLeetCode = async (req, res) => {
  req.params.platform = "leetcode";
  return syncPlatform(req, res);
};

export const syncCodeforces = async (req, res) => {
  req.params.platform = "codeforces";
  return syncPlatform(req, res);
};

export const syncGitHub = async (req, res) => {
  req.params.platform = "github";
  return syncPlatform(req, res);
};

export const syncCodeChef = async (req, res) => {
  req.params.platform = "codechef";
  return syncPlatform(req, res);
};

export const syncAtCoder = async (req, res) => {
  req.params.platform = "atcoder";
  return syncPlatform(req, res);
};

/**
 * Get sync statistics
 */
export const getSyncStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    
    // Get counts for all platforms in parallel
    const platformCountPromises = Object.keys(platformFetchers).map(async (platform) => ({
      platform,
      count: await PlatformStat.countDocuments({ platform })
    }));
    
    const platformCountResults = await Promise.all(platformCountPromises);
    const platformCounts = {};
    platformCountResults.forEach(({ platform, count }) => {
      platformCounts[platform] = count;
    });

    const lastSyncedStats = await PlatformStat.find({})
      .sort({ lastUpdated: -1 })
      .limit(10)
      .populate("userId", "email");

    res.json({
      success: true,
      data: {
        totalUsers,
        platformCounts,
        supportedPlatforms: Object.keys(platformFetchers),
        parallelConfig: PARALLEL_CONFIG,
        recentSyncs: lastSyncedStats,
      },
    });
  } catch (error) {
    logger.error("Get sync stats error", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Failed to get sync stats",
    });
  }
};
