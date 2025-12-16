import PlatformStat from "../models/PlatformStat.js";
import { fetchLeetCode } from "../utils/fetchLeetCode.js";
import { fetchGithub } from "../utils/fetchGithub.js";
import { fetchCodeforces } from "../utils/fetchCodeforces.js";

export const linkPlatform = async (req, res) => {
  const { platform, username } = req.body;

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

  res.json({ success: true, entry });
};

export const getPlatforms = async (req, res) => {
  const data = await PlatformStat.find({ userId: req.user._id });
  res.json(data);
};
