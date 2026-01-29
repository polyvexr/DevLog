import PlatformStat from "../models/PlatformStat.js";
import PlatformAction from "../models/PlatformAction.js";
import { fetchLeetCode } from "../utils/fetchLeetCode.js";
import { fetchGithub } from "../utils/fetchGithub.js";
import { fetchCodeforces } from "../utils/fetchCodeforces.js";
import { fetchCodeChef } from "../utils/fetchCodeChef.js";
import { fetchAtCoder } from "../utils/fetchAtCoder.js";
import { platformService } from "../services/platformService.js";
import logger from "../utils/logger.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

// Platform fetch function mapping
const platformFetchers = {
  leetcode: fetchLeetCode,
  codeforces: fetchCodeforces,
  github: fetchGithub,
  codechef: fetchCodeChef,
  atcoder: fetchAtCoder,
};

async function checkMonthlyLimit(userId, platform) {
  const last = await PlatformAction.findOne({ userId, platform })
    .sort({ createdAt: -1 })
    .lean();

  if (!last) return null;

  const elapsed = Date.now() - new Date(last.createdAt).getTime();
  if (elapsed < TWO_DAYS_MS) {
    const retryAfter = new Date(new Date(last.createdAt).getTime() + TWO_DAYS_MS);
    return {
      blocked: true,
      retryAfter,
      lastAction: last.action,
      lastCreatedAt: last.createdAt,
    };
  }
  return null;
}

export const linkPlatform = catchAsync(async (req, res) => {
  const { platform, username } = req.body;

  if (!platformFetchers[platform]) {
    throw new ApiError(400, `Unsupported platform: ${platform}`);
  }

  const blocked = await checkMonthlyLimit(req.user._id, platform);
  if (blocked) {
    const lastActionWasUnlink = blocked.lastAction === "unlink";
    const readdUsed = req.user.oneTimeReaddUsed?.get?.(platform) || req.user.oneTimeReaddUsed?.[platform];

    if (lastActionWasUnlink && !readdUsed) {
      if (!req.user.oneTimeReaddUsed) req.user.oneTimeReaddUsed = {};

      if (typeof req.user.oneTimeReaddUsed.set === "function") {
        req.user.oneTimeReaddUsed.set(platform, true);
      } else {
        req.user.oneTimeReaddUsed[platform] = true;
      }

      await req.user.save();
    } else {
      throw new ApiError(429, "You can add or remove this platform at most once every 2 days.", true);
    }
  }

  const existing = await PlatformStat.findOne({ userId: req.user._id, platform }).lean();
  if (existing) {
    throw new ApiError(400, "Platform already linked");
  }

  const entry = await PlatformStat.create({
    userId: req.user._id,
    platform,
    username,
    stats: {},
    lastUpdated: null,
  });

  try {
    const fetchFunction = platformFetchers[platform];
    const freshData = await fetchFunction(username);

    entry.data = freshData || {};
    entry.stats = platformService.extractStats(platform, entry.data);
    entry.lastUpdated = new Date();

    entry.markModified("data");
    entry.markModified("stats");
    await entry.save();

    logger.info("Platform linked and stats fetched", { userId: req.user._id, platform, username });
  } catch (err) {
    logger.error("Platform fetch error during link", { error: err.message, platform, username });
  }

  try {
    await PlatformAction.create({
      userId: req.user._id,
      platform,
      action: "link",
      meta: { username },
    });
  } catch (err) {
    logger.error("PlatformAction write error", { error: err.message });
  }

  res.status(201).json(new ApiResponse(201, { entry }, "Platform linked successfully"));
});

export const getPlatforms = catchAsync(async (req, res) => {
  const platforms = await PlatformStat.find({ userId: req.user._id }).lean();
  res.status(200).json(new ApiResponse(200, { platforms }));
});

export const unlinkPlatform = catchAsync(async (req, res) => {
  const platform = req.params.platform;

  const blocked = await checkMonthlyLimit(req.user._id, platform);
  if (blocked) {
    throw new ApiError(429, "You can add or remove this platform at most once every 2 days.");
  }

  const existing = await PlatformStat.findOne({ userId: req.user._id, platform }).lean();
  if (!existing) {
    throw new ApiError(404, "Platform not found");
  }

  await PlatformStat.deleteOne({ _id: existing._id });

  try {
    await PlatformAction.create({
      userId: req.user._id,
      platform,
      action: "unlink",
      meta: { username: existing.username },
    });
    logger.info("Platform unlinked", { userId: req.user._id, platform, username: existing.username });
  } catch (err) {
    logger.error("PlatformAction write error", { error: err.message });
  }

  res.status(200).json(new ApiResponse(200, null, "Platform unlinked successfully"));
});

export const refreshPlatform = catchAsync(async (req, res) => {
  const { platform } = req.params;

  if (!platformFetchers[platform]) {
    throw new ApiError(400, `Unsupported platform: ${platform}`);
  }

  const platformStat = await PlatformStat.findOne({ userId: req.user._id, platform });
  if (!platformStat) {
    throw new ApiError(404, "Platform not linked");
  }

  const freshData = await platformFetchers[platform](platformStat.username);

  platformStat.data = freshData || {};
  platformStat.stats = platformService.extractStats(platform, platformStat.data);
  platformStat.lastUpdated = new Date();
  platformStat.lastManualRefresh = new Date();

  platformStat.markModified("data");
  platformStat.markModified("stats");
  await platformStat.save();

  logger.info("Platform refreshed", { userId: req.user._id, platform, username: platformStat.username });

  res.status(200).json(new ApiResponse(200, { stat: platformStat }, "Platform stats refreshed successfully"));
});

