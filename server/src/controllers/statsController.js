import PlatformStat from "../models/PlatformStat.js";
import SyncJob from "../models/SyncJob.js";
import User from "../models/User.js";
import { platformService } from "../services/platformService.js";

// Cooldown duration (6 hours for V2)
const COOLDOWN_MS = 6 * 60 * 60 * 1000;

// Calculate progress percentage for a platform
const calculateProgress = (platform, stats) => {
  if (!stats) return 0;

  switch (platform) {
    case "leetcode": {
      const totalSolved = stats.totalSolved || 0;
      const allQuestions = stats.allQuestionsCount || 3250;
      return Math.min(Math.round((totalSolved / allQuestions) * 100), 100);
    }
    case "codeforces": {
      const rating = stats.rating || 0;
      return Math.min(Math.round((rating / 3000) * 100), 100);
    }
    case "github": {
      const recentActivity = stats.totalEvents || 0;
      return Math.min(Math.round((recentActivity / 100) * 100), 100);
    }
    default:
      return 0;
  }
};

// Get next refresh available time from user cooldowns
const getNextRefreshTime = (user, platform) => {
  const cooldown = user?.cooldowns?.[platform];
  if (!cooldown?.nextAvailable) return null;
  return new Date(cooldown.nextAvailable) > new Date() 
    ? new Date(cooldown.nextAvailable) 
    : null;
};

export const getAllStats = async (req, res) => {
  try {
    const stats = await PlatformStat.find({ userId: req.user._id });
    const user = await User.findById(req.user._id).select("cooldowns");

    // Add progress and refresh info to each platform
    const enrichedStats = stats.map((stat) => {
      const progress = calculateProgress(stat.platform, stat.stats);
      const nextRefreshAvailable = getNextRefreshTime(user, stat.platform);

      return {
        ...stat.toObject(),
        progress,
        nextRefreshAvailable,
        canRefresh: !nextRefreshAvailable,
      };
    });

    res.json({ success: true, stats: enrichedStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get aggregate stats summary
export const getStatsSummary = async (req, res) => {
  try {
    const stats = await PlatformStat.find({ userId: req.user._id });

    let totalProblemsSolved = 0;
    let totalProgress = 0;
    let activeStreak = 0;
    let lastUpdated = null;

    stats.forEach((stat) => {
      if (!lastUpdated || (stat.lastUpdated && stat.lastUpdated > lastUpdated)) {
        lastUpdated = stat.lastUpdated;
      }

      const progress = calculateProgress(stat.platform, stat.stats);
      totalProgress += progress;

      if (stat.platform === "leetcode") {
        totalProblemsSolved += stat.stats?.totalSolved || 0;
        const leetcodeStreak = stat.stats?.streakData?.currentStreak || stat.stats?.streak || 0;
        if (leetcodeStreak > activeStreak) activeStreak = leetcodeStreak;
      }

      if (stat.platform === "codeforces") {
        totalProblemsSolved += stat.stats?.problemsSolved || 0;
      }

      if (stat.platform === "github") {
        const githubActivity = stat.stats?.totalEvents || 0;
        if (githubActivity > activeStreak) activeStreak = githubActivity;
      }
    });

    const platformsLinked = stats.length;
    const averageProgress = platformsLinked > 0 ? Math.round(totalProgress / platformsLinked) : 0;

    res.json({
      success: true,
      summary: {
        platformsLinked,
        totalProblemsSolved,
        averageProgress,
        activeStreak,
        lastUpdated,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Refresh stats for a specific platform (V2 - Async via SyncJob)
 * Returns 202 Accepted immediately, job processed by cron
 */
export const refreshPlatformStats = async (req, res) => {
  try {
    const { platform } = req.params;
    const supportedPlatforms = ["leetcode", "codeforces", "github", "codechef", "atcoder"];

    if (!supportedPlatforms.includes(platform)) {
      return res.status(400).json({ message: "Invalid platform" });
    }

    // Verify platform is linked
    const platformStat = await PlatformStat.findOne({
      userId: req.user._id,
      platform,
    });

    if (!platformStat) {
      return res.status(404).json({ message: "Platform not linked" });
    }

    // Check cooldown from user document
    const canRefresh = await platformService.canRefresh(req.user._id, platform);
    
    if (!canRefresh.allowed) {
      const remainingMinutes = Math.ceil(canRefresh.remainingMs / (60 * 1000));
      return res.status(429).json({
        message: `Please wait ${remainingMinutes} minutes before refreshing again`,
        nextRefreshAvailable: canRefresh.nextAvailable,
      });
    }

    // Process sync job synchronously for the user
    // We create a temporary job object or just call the service method
    const job = {
      userId: req.user._id,
      platform,
      save: async () => {}, // Mock save
    };

    const result = await platformService.processSyncJob(job);

    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        message: `Failed to refresh ${platform}: ${result.error}` 
      });
    }

    // Get the updated stat
    const updatedStat = await PlatformStat.findOne({
      userId: req.user._id,
      platform,
    });

    // Determine progress
    const progress = calculateProgress(platform, updatedStat.stats);

    res.json({
      success: true,
      message: "Platform stats refreshed successfully",
      data: { 
        stat: {
          ...updatedStat.toObject(),
          progress,
          canRefresh: false,
          nextRefreshAvailable: new Date(Date.now() + COOLDOWN_MS)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get refresh job status
 */
export const getRefreshStatus = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await SyncJob.findOne({
      _id: jobId,
      userId: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({
      success: true,
      job: {
        id: job._id,
        platform: job.platform,
        status: job.status,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        error: job.lastError,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
