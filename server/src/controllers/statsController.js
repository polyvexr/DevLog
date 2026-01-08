import PlatformStat from "../models/PlatformStat.js";
import { fetchLeetCode } from "../utils/fetchLeetCode.js";
import { fetchCodeforces } from "../utils/fetchCodeforces.js";
import { fetchGithub } from "../utils/fetchGithub.js";

// Calculate progress percentage for a platform
const calculateProgress = (platform, stats) => {
  if (!stats) return 0;

  switch (platform) {
    case "leetcode": {
      // Progress based on total problems solved vs all questions
      const totalSolved = stats.totalSolved || 0;
      const allQuestions = stats.allQuestionsCount || 3250; // Fallback total
      return Math.min(Math.round((totalSolved / allQuestions) * 100), 100);
    }
    case "codeforces": {
      // Progress based on rating (3000 = grandmaster level target)
      const rating = stats.rating || 0;
      return Math.min(Math.round((rating / 3000) * 100), 100);
    }
    case "github": {
      // Progress based on recent activity (max 100 events from API)
      const recentActivity = stats.totalEvents || 0;
      return Math.min(Math.round((recentActivity / 100) * 100), 100);
    }
    default:
      return 0;
  }
};

// Get next refresh available time
const getNextRefreshTime = (lastManualRefresh) => {
  if (!lastManualRefresh) return null;
  const cooldownMs = 60 * 60 * 1000; // 1 hour
  const nextRefresh = new Date(lastManualRefresh.getTime() + cooldownMs);
  return nextRefresh > new Date() ? nextRefresh : null;
};

export const getAllStats = async (req, res) => {
  const stats = await PlatformStat.find({ userId: req.user._id });

  // Add progress and refresh info to each platform
  const enrichedStats = stats.map((stat) => {
    const progress = calculateProgress(stat.platform, stat.stats);
    const nextRefreshAvailable = getNextRefreshTime(stat.lastManualRefresh);

    return {
      ...stat.toObject(),
      progress,
      nextRefreshAvailable,
      canRefresh: !nextRefreshAvailable,
    };
  });

  res.json({ success: true, stats: enrichedStats });
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
      // Track most recent update
      if (
        !lastUpdated ||
        (stat.lastUpdated && stat.lastUpdated > lastUpdated)
      ) {
        lastUpdated = stat.lastUpdated;
      }

      const progress = calculateProgress(stat.platform, stat.stats);
      totalProgress += progress;

      if (stat.platform === "leetcode") {
        totalProblemsSolved += stat.stats?.totalSolved || 0;
        // Streak is in streakData.currentStreak
        const leetcodeStreak =
          stat.stats?.streakData?.currentStreak || stat.stats?.streak || 0;
        if (leetcodeStreak > activeStreak) activeStreak = leetcodeStreak;
      }

      if (stat.platform === "codeforces") {
        totalProblemsSolved += stat.stats?.problemsSolved || 0;
      }

      if (stat.platform === "github") {
        // Use total events as activity indicator
        const githubActivity = stat.stats?.totalEvents || 0;
        if (githubActivity > activeStreak) activeStreak = githubActivity;
      }
    });

    const platformsLinked = stats.length;
    const averageProgress =
      platformsLinked > 0 ? Math.round(totalProgress / platformsLinked) : 0;

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

// Refresh stats for a specific platform
export const refreshPlatformStats = async (req, res) => {
  try {
    const { platform } = req.params;

    if (!["leetcode", "codeforces", "github"].includes(platform)) {
      return res.status(400).json({ message: "Invalid platform" });
    }

    const platformStat = await PlatformStat.findOne({
      userId: req.user._id,
      platform,
    });

    if (!platformStat) {
      return res.status(404).json({ message: "Platform not linked" });
    }

    // Check cooldown (1 hour)
    const cooldownMs = 60 * 60 * 1000;
    if (platformStat.lastManualRefresh) {
      const timeSinceRefresh =
        Date.now() - platformStat.lastManualRefresh.getTime();
      if (timeSinceRefresh < cooldownMs) {
        const remainingMs = cooldownMs - timeSinceRefresh;
        const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
        return res.status(429).json({
          message: `Please wait ${remainingMinutes} minutes before refreshing again`,
          nextRefreshAvailable: new Date(
            platformStat.lastManualRefresh.getTime() + cooldownMs
          ),
        });
      }
    }

    // Fetch fresh stats
    let newStats;
    try {
      switch (platform) {
        case "leetcode":
          newStats = await fetchLeetCode(platformStat.username);
          break;
        case "codeforces":
          newStats = await fetchCodeforces(platformStat.username);
          break;
        case "github":
          newStats = await fetchGithub(platformStat.username);
          break;
      }
    } catch (fetchError) {
      return res
        .status(500)
        .json({ message: "Failed to fetch stats from platform" });
    }

    // Update the stats
    platformStat.stats = newStats;
    platformStat.lastUpdated = new Date();
    platformStat.lastManualRefresh = new Date();
    await platformStat.save();

    const progress = calculateProgress(platform, newStats);
    const nextRefreshAvailable = new Date(Date.now() + cooldownMs);

    res.json({
      success: true,
      stat: {
        ...platformStat.toObject(),
        progress,
        nextRefreshAvailable,
        canRefresh: false,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
