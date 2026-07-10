import PlatformStat from "../models/PlatformStat.js";
import PlatformAction from "../models/PlatformAction.js";
import User from "../models/User.js";
import { platformService, platformFetchers } from "../services/platformService.js";
import logger from "../utils/logger.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";



export const linkPlatform = catchAsync(async (req, res) => {
  const { platform, username } = req.body;
  const fetchFunction = platformFetchers[platform];

  if (!fetchFunction) {
    throw new ApiError(400, `Unsupported platform: ${platform}`);
  }

  // Check if already linked
  const existing = await PlatformStat.findOne({ userId: req.user._id, platform }).lean();
  if (existing) {
    throw new ApiError(400, "Platform already linked");
  }

  // Initial fetch
  let freshData = {};
  try {
    freshData = await fetchFunction(username);
    if (freshData?.error) throw new Error(freshData.error);
  } catch (err) {
    logger.error("Initial platform fetch failed", { platform, username, error: err.message });
    // We still link it, but with empty data
  }

  // Create entry
  const entry = await PlatformStat.create({
    userId: req.user._id,
    platform,
    username,
    data: freshData,
    stats: platformService.extractStats(platform, freshData),
    lastUpdated: freshData?.error ? null : new Date(),
  });

  // Log action
  await PlatformAction.create({
    userId: req.user._id,
    platform,
    action: "link",
    meta: { username },
  }).catch(err => logger.error("PlatformAction write error", { error: err.message }));

  res.status(201).json(new ApiResponse(201, { entry }, "Platform linked successfully"));
});


export const getPlatforms = catchAsync(async (req, res) => {
  const platforms = await PlatformStat.find({ userId: req.user._id }).lean();
  res.status(200).json(new ApiResponse(200, { platforms }));
});


export const unlinkPlatform = catchAsync(async (req, res) => {
  const { platform } = req.params;

  const existing = await PlatformStat.findOne({ userId: req.user._id, platform }).lean();
  if (!existing) {
    throw new ApiError(404, "Platform not found");
  }

  await PlatformStat.deleteOne({ _id: existing._id });

  // Log action
  await PlatformAction.create({
    userId: req.user._id,
    platform,
    action: "unlink",
    meta: { username: existing.username },
  }).catch(err => logger.error("PlatformAction write error", { error: err.message }));

  res.status(200).json(new ApiResponse(200, null, "Platform unlinked successfully"));
});
