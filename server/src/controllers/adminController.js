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

/**
 * Generic sync function for any platform
 * @param {string} platform - Platform name
 * @returns {object} Sync results
 */
async function syncPlatformStats(platform) {
  const fetchFunction = platformFetchers[platform];
  
  if (!fetchFunction) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  const platformStats = await PlatformStat.find({ platform }).populate("userId", "email");
  
  const syncResults = {
    platform,
    total: platformStats.length,
    success: 0,
    failed: 0,
    details: [],
  };

  for (const platformStat of platformStats) {
    if (!platformStat.username || !platformStat.userId) continue;

    try {
      const data = await fetchFunction(platformStat.username);
      platformStat.stats = data;
      platformStat.lastUpdated = Date.now();
      await platformStat.save();

      syncResults.success++;
      syncResults.details.push({
        user: platformStat.userId.email,
        username: platformStat.username,
        status: "success",
      });
    } catch (error) {
      syncResults.failed++;
      syncResults.details.push({
        user: platformStat.userId?.email || "Unknown",
        username: platformStat.username,
        status: "failed",
        error: error.message,
      });
    }
  }

  logger.info(`Sync completed for ${platform}`, {
    total: syncResults.total,
    success: syncResults.success,
    failed: syncResults.failed,
  });

  return syncResults;
}

// Sync all platforms for all users
export const syncAllPlatforms = async (req, res) => {
  try {
    const allPlatforms = Object.keys(platformFetchers);
    const results = {};

    for (const platform of allPlatforms) {
      try {
        results[platform] = await syncPlatformStats(platform);
      } catch (error) {
        results[platform] = { error: error.message };
        logger.error(`Sync failed for ${platform}`, { error: error.message });
      }
    }

    // Calculate totals
    const totals = {
      total: 0,
      success: 0,
      failed: 0,
    };

    Object.values(results).forEach((result) => {
      if (result.total) {
        totals.total += result.total;
        totals.success += result.success || 0;
        totals.failed += result.failed || 0;
      }
    });

    res.json({
      success: true,
      message: "Sync completed for all platforms",
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

// Sync specific platform for all users
export const syncPlatform = async (req, res) => {
  const { platform } = req.params;

  if (!platformFetchers[platform]) {
    return res.status(400).json({
      success: false,
      message: `Unsupported platform: ${platform}. Supported: ${Object.keys(platformFetchers).join(", ")}`,
    });
  }

  try {
    const results = await syncPlatformStats(platform);

    res.json({
      success: true,
      message: `${platform} sync completed`,
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

// Get sync statistics
export const getSyncStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    
    // Get counts for all platforms dynamically
    const platformCounts = {};
    for (const platform of Object.keys(platformFetchers)) {
      platformCounts[platform] = await PlatformStat.countDocuments({ platform });
    }

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
