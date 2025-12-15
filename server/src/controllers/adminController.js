import User from "../models/User.js";
import PlatformStat from "../models/PlatformStat.js";
import { fetchLeetCode } from "../utils/fetchLeetCode.js";
import { fetchCodeforces } from "../utils/fetchCodeforces.js";
import { fetchGithub } from "../utils/fetchGithub.js";

// Sync all platforms for all users
export const syncAllPlatforms = async (req, res) => {
  try {
    // Get all platform stats (which contain the usernames)
    const platformStats = await PlatformStat.find({}).populate(
      "userId",
      "email"
    );
    let syncResults = {
      total: 0,
      success: 0,
      failed: 0,
      details: [],
    };

    for (const platformStat of platformStats) {
      if (!platformStat.username || !platformStat.userId) continue;

      syncResults.total++;

      try {
        let data;
        if (platformStat.platform === "leetcode") {
          data = await fetchLeetCode(platformStat.username);
        } else if (platformStat.platform === "codeforces") {
          data = await fetchCodeforces(platformStat.username);
        } else if (platformStat.platform === "github") {
          data = await fetchGithub(platformStat.username);
        }

        // Update the stats
        platformStat.stats = data;
        platformStat.lastUpdated = Date.now();
        await platformStat.save();

        syncResults.success++;
        syncResults.details.push({
          user: platformStat.userId.email,
          platform: platformStat.platform,
          username: platformStat.username,
          status: "success",
        });
      } catch (error) {
        syncResults.failed++;
        syncResults.details.push({
          user: platformStat.userId?.email || "Unknown",
          platform: platformStat.platform,
          username: platformStat.username,
          status: "failed",
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      message: "Sync completed",
      results: syncResults,
    });
  } catch (error) {
    console.error("Sync all platforms error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync platforms",
      error: error.message,
    });
  }
};

// Sync LeetCode for all users
export const syncLeetCode = async (req, res) => {
  try {
    const platformStats = await PlatformStat.find({
      platform: "leetcode",
    }).populate("userId", "email");
    let syncResults = {
      total: platformStats.length,
      success: 0,
      failed: 0,
      details: [],
    };

    for (const platformStat of platformStats) {
      if (!platformStat.username || !platformStat.userId) continue;

      try {
        const data = await fetchLeetCode(platformStat.username);
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

    res.json({
      success: true,
      message: "LeetCode sync completed",
      results: syncResults,
    });
  } catch (error) {
    console.error("Sync LeetCode error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync LeetCode",
      error: error.message,
    });
  }
};

// Sync Codeforces for all users
export const syncCodeforces = async (req, res) => {
  try {
    const platformStats = await PlatformStat.find({
      platform: "codeforces",
    }).populate("userId", "email");
    let syncResults = {
      total: platformStats.length,
      success: 0,
      failed: 0,
      details: [],
    };

    for (const platformStat of platformStats) {
      if (!platformStat.username || !platformStat.userId) continue;

      try {
        const data = await fetchCodeforces(platformStat.username);
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

    res.json({
      success: true,
      message: "Codeforces sync completed",
      results: syncResults,
    });
  } catch (error) {
    console.error("Sync Codeforces error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync Codeforces",
      error: error.message,
    });
  }
};

// Sync GitHub for all users
export const syncGitHub = async (req, res) => {
  try {
    const platformStats = await PlatformStat.find({
      platform: "github",
    }).populate("userId", "email");
    let syncResults = {
      total: platformStats.length,
      success: 0,
      failed: 0,
      details: [],
    };

    for (const platformStat of platformStats) {
      if (!platformStat.username || !platformStat.userId) continue;

      try {
        const data = await fetchGithub(platformStat.username);
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

    res.json({
      success: true,
      message: "GitHub sync completed",
      results: syncResults,
    });
  } catch (error) {
    console.error("Sync GitHub error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync GitHub",
      error: error.message,
    });
  }
};

// Get sync statistics
export const getSyncStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const usersWithLeetCode = await PlatformStat.countDocuments({
      platform: "leetcode",
    });
    const usersWithCodeforces = await PlatformStat.countDocuments({
      platform: "codeforces",
    });
    const usersWithGitHub = await PlatformStat.countDocuments({
      platform: "github",
    });

    const lastSyncedStats = await PlatformStat.find({})
      .sort({ lastUpdated: -1 })
      .limit(10)
      .populate("userId", "email");

    res.json({
      success: true,
      stats: {
        totalUsers,
        platformCounts: {
          leetcode: usersWithLeetCode,
          codeforces: usersWithCodeforces,
          github: usersWithGitHub,
        },
        recentSyncs: lastSyncedStats,
      },
    });
  } catch (error) {
    console.error("Get sync stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get sync stats",
      error: error.message,
    });
  }
};
