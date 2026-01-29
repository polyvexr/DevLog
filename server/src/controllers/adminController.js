import User from "../models/User.js";
import PlatformStat from "../models/PlatformStat.js";
import { fetchLeetCode } from "../utils/fetchLeetCode.js";
import { fetchCodeforces } from "../utils/fetchCodeforces.js";
import { fetchGithub } from "../utils/fetchGithub.js";
import { fetchCodeChef } from "../utils/fetchCodeChef.js";
import { fetchAtCoder } from "../utils/fetchAtCoder.js";
import logger from "../utils/logger.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Platform fetch function mapping
const platformFetchers = {
  leetcode: fetchLeetCode,
  codeforces: fetchCodeforces,
  github: fetchGithub,
  codechef: fetchCodeChef,
  atcoder: fetchAtCoder,
};

/**
 * Get all users with their platform details
 * Optimized to avoid N+1 queries
 */
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({}, "name email role publicProfile createdAt").lean();
  const userIds = users.map(u => u._id);

  const allPlatforms = await PlatformStat.find(
    { userId: { $in: userIds } },
    "userId platform username stats lastUpdated"
  ).lean();

  const usersWithStats = users.map(user => ({
    ...user,
    platforms: allPlatforms.filter(p => p.userId.toString() === user._id.toString())
  }));

  res.status(200).json(new ApiResponse(200, usersWithStats));
});

import { platformService } from "../services/platformService.js";

// Concurrency configuration
const PARALLEL_CONFIG = {
  maxConcurrentUsers: 5,     // Max users to sync in parallel per platform
  maxConcurrentPlatforms: 5, // Max platforms to sync in parallel
};

/**
 * Sync a single user's platform data
 */
async function syncSingleUser(platformStat, platform, fetchFunction) {
  if (!platformStat.username || !platformStat.userId) {
    return { status: "skipped", reason: "Missing username or userId" };
  }

  try {
    const data = await fetchFunction(platformStat.username);

    if (data && Object.keys(data).length > 0 && !data.error) {
      const stats = platformService.extractStats(platform, data);

      await PlatformStat.updateOne(
        { _id: platformStat._id },
        {
          $set: {
            data,
            stats,
            lastUpdated: Date.now()
          }
        }
      );

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
        reason: data?.error || "No data returned from API",
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
 */
async function parallelProcess(items, processor, concurrency) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(processor));

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
 * Sync all users for a specific platform
 */
async function syncPlatformStatsParallel(platform) {
  const fetchFunction = platformFetchers[platform];
  if (!fetchFunction) throw new Error(`Unknown platform: ${platform}`);

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

  const results = await parallelProcess(
    platformStats,
    (stat) => syncSingleUser(stat, platform, fetchFunction),
    PARALLEL_CONFIG.maxConcurrentUsers
  );

  results.forEach((result) => {
    syncResults[result.status]++;
    syncResults.details.push(result);
  });

  syncResults.duration = Date.now() - startTime;
  logger.info(`Sync completed for ${platform}`, { ...syncResults, details: undefined });
  return syncResults;
}

/**
 * Sync all platforms for all users
 */
export const syncAllPlatforms = catchAsync(async (req, res) => {
  const startTime = Date.now();
  const allPlatforms = Object.keys(platformFetchers);

  logger.info("Starting parallel sync for all platforms", { platforms: allPlatforms });

  const platformResults = await Promise.allSettled(
    allPlatforms.map(platform => syncPlatformStatsParallel(platform))
  );

  const results = {};
  const totals = { total: 0, success: 0, failed: 0, empty: 0, skipped: 0, duration: 0 };

  platformResults.forEach((result, idx) => {
    const platform = allPlatforms[idx];
    if (result.status === "fulfilled") {
      results[platform] = result.value;
      totals.total += result.value.total;
      totals.success += result.value.success;
      totals.failed += result.value.failed;
      totals.empty += result.value.empty;
      totals.skipped += result.value.skipped;
    } else {
      results[platform] = { platform, error: result.reason?.message || "Unknown error" };
    }
  });

  totals.duration = Date.now() - startTime;
  res.status(200).json(new ApiResponse(200, { totals, platforms: results }, "Global sync completed"));
});

/**
 * Sync specific platform for all users
 */
export const syncPlatform = catchAsync(async (req, res) => {
  const { platform } = req.params;
  if (!platformFetchers[platform]) {
    throw new ApiError(400, `Unsupported platform: ${platform}`);
  }

  const results = await syncPlatformStatsParallel(platform);
  res.status(200).json(new ApiResponse(200, { results }, `${platform} sync completed`));
});

// Legacy handlers simplified - using the base syncPlatform handler
export const syncLeetCode = (req, res, next) => { req.params.platform = "leetcode"; return syncPlatform(req, res, next); };
export const syncCodeforces = (req, res, next) => { req.params.platform = "codeforces"; return syncPlatform(req, res, next); };
export const syncGitHub = (req, res, next) => { req.params.platform = "github"; return syncPlatform(req, res, next); };
export const syncCodeChef = (req, res, next) => { req.params.platform = "codechef"; return syncPlatform(req, res, next); };
export const syncAtCoder = (req, res, next) => { req.params.platform = "atcoder"; return syncPlatform(req, res, next); };


/**
 * Get sync statistics
 */
export const getSyncStats = catchAsync(async (req, res) => {
  const [totalUsers, platformCountResults, lastSyncedStats] = await Promise.all([
    User.countDocuments({}),
    Promise.all(Object.keys(platformFetchers).map(async (platform) => ({
      platform,
      count: await PlatformStat.countDocuments({ platform })
    }))),
    PlatformStat.find({})
      .sort({ lastUpdated: -1 })
      .limit(10)
      .populate("userId", "email")
      .lean()
  ]);

  const platformCounts = {};
  platformCountResults.forEach(({ platform, count }) => { platformCounts[platform] = count; });

  res.status(200).json(new ApiResponse(200, {
    totalUsers,
    platformCounts,
    supportedPlatforms: Object.keys(platformFetchers),
    parallelConfig: PARALLEL_CONFIG,
    recentSyncs: lastSyncedStats,
  }));
});

