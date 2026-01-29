import PlatformStat from "../models/PlatformStat.js";
import SyncJob from "../models/SyncJob.js";
import User from "../models/User.js";
import { platformService } from "../services/platformService.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Cooldown duration (6 hours for V2)
const COOLDOWN_MS = 6 * 60 * 60 * 1000;

// Get next refresh available time from user cooldowns
const getNextRefreshTime = (user, platform) => {
  const cooldown = user?.cooldowns?.[platform];
  if (!cooldown?.nextAvailable) return null;
  const next = new Date(cooldown.nextAvailable);
  return next > new Date() ? next : null;
};

export const getAllStats = catchAsync(async (req, res) => {
  const [stats, user] = await Promise.all([
    PlatformStat.find({ userId: req.user._id }).lean(),
    User.findById(req.user._id).select("cooldowns").lean()
  ]);

  const enrichedStats = stats.map((stat) => {
    const nextRefreshAvailable = getNextRefreshTime(user, stat.platform);
    return {
      ...stat,
      nextRefreshAvailable,
      canRefresh: !nextRefreshAvailable,
    };
  });

  res.status(200).json(new ApiResponse(200, { stats: enrichedStats }));
});

// Get aggregate stats summary
export const getStatsSummary = catchAsync(async (req, res) => {
  const stats = await PlatformStat.find({ userId: req.user._id }).lean();

  let totalProblemsSolved = 0;
  let lastUpdated = null;

  stats.forEach((stat) => {
    if (!lastUpdated || (stat.lastUpdated && new Date(stat.lastUpdated) > new Date(lastUpdated))) {
      lastUpdated = stat.lastUpdated;
    }

    const s = stat.stats || {};
    totalProblemsSolved += s.totalSolved || s.problemsSolved || s.acCount || 0;
  });

  const summary = {
    platformsLinked: stats.length,
    totalProblemsSolved,
    lastUpdated,
  };

  res.status(200).json(new ApiResponse(200, { summary }));
});

/**
 * Refresh stats for a specific platform
 */
export const refreshPlatformStats = catchAsync(async (req, res) => {
  const { platform } = req.params;
  const supportedPlatforms = ["leetcode", "codeforces", "github", "codechef", "atcoder"];

  if (!supportedPlatforms.includes(platform)) {
    throw new ApiError(400, "Invalid platform");
  }

  // Verify platform is linked
  const platformStat = await PlatformStat.findOne({ userId: req.user._id, platform }).lean();
  if (!platformStat) {
    throw new ApiError(404, "Platform not linked");
  }

  // Check cooldown
  const canRefresh = await platformService.canRefresh(req.user._id, platform);
  if (!canRefresh.allowed) {
    const remainingMinutes = Math.ceil(canRefresh.remainingMs / (60 * 1000));
    throw new ApiError(429, `Please wait ${remainingMinutes} minutes before refreshing again`);
  }

  // Process sync job
  const job = { userId: req.user._id, platform, save: async () => { } };
  const result = await platformService.processSyncJob(job);

  if (!result.success) {
    throw new ApiError(500, `Failed to refresh ${platform}: ${result.error}`);
  }

  const updatedStat = await PlatformStat.findOne({ userId: req.user._id, platform }).lean();

  res.status(200).json(new ApiResponse(200, {
    stat: {
      ...updatedStat,
      canRefresh: false,
      nextRefreshAvailable: new Date(Date.now() + COOLDOWN_MS)
    }
  }, "Platform stats refreshed successfully"));
});

/**
 * Get refresh job status
 */
export const getRefreshStatus = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const job = await SyncJob.findOne({ _id: jobId, userId: req.user._id }).lean();

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  res.status(200).json(new ApiResponse(200, {
    job: {
      id: job._id,
      platform: job.platform,
      status: job.status,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      error: job.lastError,
    }
  }));
});

