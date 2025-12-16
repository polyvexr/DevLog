import PlatformStat from "../models/PlatformStat.js";
import PlatformAction from "../models/PlatformAction.js";
import { fetchLeetCode } from "../utils/fetchLeetCode.js";
import { fetchGithub } from "../utils/fetchGithub.js";
import { fetchCodeforces } from "../utils/fetchCodeforces.js";

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

async function checkMonthlyLimit(userId, platform) {
  const last = await PlatformAction.findOne({ userId, platform }).sort({
    createdAt: -1,
  });
  if (!last) return null;
  const elapsed = Date.now() - new Date(last.createdAt).getTime();
  if (elapsed < FIFTEEN_DAYS_MS) {
    const retryAfter = new Date(
      new Date(last.createdAt).getTime() + FIFTEEN_DAYS_MS
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
        console.error("Failed to mark oneTimeReaddUsed:", err?.message || err);
      }
      // allow link to proceed
    } else {
      return res.status(429).json({
        message:
          "You can add or remove this platform at most once every 15 days.",
        retryAfter: blocked.retryAfter,
      });
    }
  }

  const existing = await PlatformStat.findOne({
    userId: req.user._id,
    platform,
  });
  if (existing)
    return res.status(400).json({ message: "Platform already linked" });

  const entry = await PlatformStat.create({
    userId: req.user._id,
    platform,
    username,
    stats: {},
    lastUpdated: null,
  });

  // Fetch platform stats immediately for this user only
  try {
    let fetched = {};
    if (platform === "leetcode") {
      fetched = await fetchLeetCode(username);
    } else if (platform === "github") {
      fetched = await fetchGithub(username);
    } else if (platform === "codeforces") {
      fetched = await fetchCodeforces(username);
    }

    entry.stats = fetched || {};
    entry.lastUpdated = new Date();
    await entry.save();
  } catch (err) {
    console.error("Platform fetch error:", err?.message || err);
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
    console.error("PlatformAction write error:", err?.message || err);
  }

  res.json({ success: true, entry });
};

export const getPlatforms = async (req, res) => {
  const data = await PlatformStat.find({ userId: req.user._id });
  res.json(data);
};

export const unlinkPlatform = async (req, res) => {
  const platform = req.params.platform;

  // Enforce monthly-per-platform restriction
  const blocked = await checkMonthlyLimit(req.user._id, platform);
  if (blocked) {
    return res.status(429).json({
      message:
        "You can add or remove this platform at most once every 15 days.",
      retryAfter: blocked.retryAfter,
    });
  }

  const existing = await PlatformStat.findOne({
    userId: req.user._id,
    platform,
  });
  if (!existing) return res.status(404).json({ message: "Platform not found" });

  await PlatformStat.deleteOne({ _id: existing._id });

  // Record action
  try {
    await PlatformAction.create({
      userId: req.user._id,
      platform,
      action: "unlink",
      meta: { username: existing.username },
    });
  } catch (err) {
    console.error("PlatformAction write error:", err?.message || err);
  }

  res.json({ success: true, message: "Platform unlinked" });
};
