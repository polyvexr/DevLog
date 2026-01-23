import PlatformStat from "../models/PlatformStat.js";
import PlatformAction from "../models/PlatformAction.js";
import { fetchLeetCode } from "../utils/fetchLeetCode.js";
import { fetchGithub } from "../utils/fetchGithub.js";
import { fetchCodeforces } from "../utils/fetchCodeforces.js";
import { fetchCodeChef } from "../utils/fetchCodeChef.js";
import { fetchAtCoder } from "../utils/fetchAtCoder.js";
import { platformService } from "../services/platformService.js";
import logger from "../utils/logger.js";

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
  const last = await PlatformAction.findOne({ userId, platform }).sort({
    createdAt: -1,
  });
  if (!last) return null;
  const elapsed = Date.now() - new Date(last.createdAt).getTime();
  if (elapsed < TWO_DAYS_MS) {
    const retryAfter = new Date(
      new Date(last.createdAt).getTime() + TWO_DAYS_MS
    );
    return {
      blocked: true,
      retryAfter,
      lastAction: last.action,
      lastCreatedAt: last.createdAt,
    };
  }
  return null;
}

export const linkPlatform = async (req, res) => {
  const { platform, username } = req.body;

  // Validate platform
  if (!platformFetchers[platform]) {
    return res.status(400).json({
      success: false,
      message: `Unsupported platform: ${platform}`
    });
  }

  // Enforce 15-day-per-platform restriction with one-time re-add exception
  const blocked = await checkMonthlyLimit(req.user._id, platform);
  if (blocked) {
    // Allow a single one-time re-add after a deletion if the user hasn't used it yet
    const lastActionWasUnlink = blocked.lastAction === "unlink";
    const readdUsed = req.user.oneTimeReaddUsed
      ? typeof req.user.oneTimeReaddUsed.get === "function"
        ? req.user.oneTimeReaddUsed.get(platform)
        : req.user.oneTimeReaddUsed[platform]
      : false;

    if (lastActionWasUnlink && !readdUsed) {
      // mark the one-time readd as used for this platform
      if (!req.user.oneTimeReaddUsed) req.user.oneTimeReaddUsed = {};
      if (typeof req.user.oneTimeReaddUsed.set === "function") {
        req.user.oneTimeReaddUsed.set(platform, true);
      } else {
        req.user.oneTimeReaddUsed[platform] = true;
      }
      try {
        await req.user.save();
      } catch (err) {
        logger.error("Failed to mark oneTimeReaddUsed", { error: err.message });
      }
      // allow link to proceed
    } else {
      return res.status(429).json({
        success: false,
        message: "You can add or remove this platform at most once every 2 days.",
        retryAfter: blocked.retryAfter,
      });
    }
  }

  const existing = await PlatformStat.findOne({
    userId: req.user._id,
    platform,
  });
  if (existing) {
    return res.status(400).json({ success: false, message: "Platform already linked" });
  }

  const entry = await PlatformStat.create({
    userId: req.user._id,
    platform,
    username,
    stats: {},
    lastUpdated: null,
  });

  // Fetch platform stats immediately for this user only
  try {
    const fetchFunction = platformFetchers[platform];
    const freshData = await fetchFunction(username);

    // Use platformService to normalize data consistently
    entry.data = freshData || {};
    entry.stats = platformService.extractStats(platform, entry.data);
    entry.lastUpdated = new Date();

    // Explicitly mark Mixed types as modified
    entry.markModified("data");
    entry.markModified("stats");

    await entry.save();

    logger.info("Platform linked and stats fetched", {
      userId: req.user._id,
      platform,
      username
    });
  } catch (err) {
    logger.error("Platform fetch error during link", {
      error: err.message,
      platform,
      username
    });
    // keep entry with empty stats; do not fail the link operation
  }

  // Record the action for monthly-enforcement/audit
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

  res.json({ success: true, message: "Platform linked successfully", data: { entry } });
};

export const getPlatforms = async (req, res) => {
  try {
    const data = await PlatformStat.find({ userId: req.user._id });
    res.json({ success: true, data: { platforms: data } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const unlinkPlatform = async (req, res) => {
  const platform = req.params.platform;

  // Enforce monthly-per-platform restriction
  const blocked = await checkMonthlyLimit(req.user._id, platform);
  if (blocked) {
    return res.status(429).json({
      success: false,
      message: "You can add or remove this platform at most once every 2 days.",
      retryAfter: blocked.retryAfter,
    });
  }

  const existing = await PlatformStat.findOne({
    userId: req.user._id,
    platform,
  });
  if (!existing) {
    return res.status(404).json({ success: false, message: "Platform not found" });
  }

  await PlatformStat.deleteOne({ _id: existing._id });

  // Record action
  try {
    await PlatformAction.create({
      userId: req.user._id,
      platform,
      action: "unlink",
      meta: { username: existing.username },
    });

    logger.info("Platform unlinked", {
      userId: req.user._id,
      platform,
      username: existing.username
    });
  } catch (err) {
    logger.error("PlatformAction write error", { error: err.message });
  }

  res.json({ success: true, message: "Platform unlinked successfully" });
};

/**
 * Refresh platform stats
 * POST /api/platforms/:platform/refresh
 */
export const refreshPlatform = async (req, res) => {
  const { platform } = req.params;

  // Validate platform
  if (!platformFetchers[platform]) {
    return res.status(400).json({
      success: false,
      message: `Unsupported platform: ${platform}`
    });
  }

  try {
    const platformStat = await PlatformStat.findOne({
      userId: req.user._id,
      platform,
    });

    if (!platformStat) {
      return res.status(404).json({ success: false, message: "Platform not linked" });
    }

    const fetchFunction = platformFetchers[platform];
    const freshData = await fetchFunction(platformStat.username);

    platformStat.data = freshData || {};
    platformStat.stats = platformService.extractStats(platform, platformStat.data);
    platformStat.lastUpdated = new Date();
    platformStat.lastManualRefresh = new Date();

    // Explicitly mark Mixed types as modified
    platformStat.markModified("data");
    platformStat.markModified("stats");

    await platformStat.save();

    logger.info("Platform refreshed", {
      userId: req.user._id,
      platform,
      username: platformStat.username
    });

    res.json({
      success: true,
      message: "Platform stats refreshed successfully",
      data: { stat: platformStat }
    });
  } catch (err) {
    logger.error("Platform refresh error", { error: err.message, platform });
    res.status(500).json({ success: false, message: "Failed to refresh platform stats" });
  }
};
