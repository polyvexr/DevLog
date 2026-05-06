import User from "../models/User.js";
import PlatformStat from "../models/PlatformStat.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

/**
 * Public Profile Controller - Unauthenticated public developer profiles
 */

/**
 * Get public profile by username
 * GET /u/:username
 */
export const getPublicProfile = catchAsync(async (req, res) => {
  const { username } = req.params;

  // Find user by public profile username
  const user = await User.findOne({
    "publicProfile.username": username
  }).select("name profile publicProfile createdAt").lean();

  if (!user) {
    throw new ApiError(404, "Profile not found");
  }

  // Determine which platforms to show
  const platformsToShow = [];
  const pp = user.publicProfile;
  if (pp.showLeetCode) platformsToShow.push("leetcode");
  if (pp.showCodeforces) platformsToShow.push("codeforces");
  if (pp.showGitHub) platformsToShow.push("github");
  if (pp.showCodeChef) platformsToShow.push("codechef");
  if (pp.showAtCoder) platformsToShow.push("atcoder");

  const platformStats = await PlatformStat.find({
    userId: user._id,
    platform: { $in: platformsToShow }
  }).select("platform username data stats lastUpdated").lean();

  const aggregateStats = calculateAggregateStats(platformStats);

  // Set public cache for 5 minutes to improve performance for shared profiles
  res.setHeader("Cache-Control", "public, max-age=300");

  res.status(200).json(new ApiResponse(200, {
    profile: {
      name: user.name,
      username: pp.username,
      avatar: user.profile?.avatar || "",
      bio: user.profile?.bio || "",
      location: user.profile?.location || "",
      website: user.profile?.website || "",
      socials: user.profile?.socials || [],
      memberSince: user.createdAt
    },
    platforms: platformStats.map(p => ({
      platform: p.platform,
      username: p.username,
      stats: p.stats,
      lastUpdated: p.lastUpdated
    })),
    aggregateStats
  }));
});

/**
 * Calculate aggregate stats from all platforms
 */
function calculateAggregateStats(platformStats) {
  const stats = {
    totalProblemsSolved: 0,
    totalContests: 0,
    platforms: platformStats.length,
    badges: []
  };

  for (const ps of platformStats) {
    const s = ps.stats || {};
    const solved = s.totalSolved || s.problemsSolved || s.acCount || 0;
    const rating = s.rating || s.currentRating || 0;

    switch (ps.platform) {
      case "leetcode":
        stats.totalProblemsSolved += solved;
        if (solved >= 500) stats.badges.push({ type: "leetcode_500", label: "500+ LeetCode Problems", platform: "LeetCode" });
        if ((s.hardSolved || 0) >= 100) stats.badges.push({ type: "leetcode_hard_100", label: "100+ Hard Problems", platform: "LeetCode" });
        break;
      case "codeforces":
        stats.totalContests += s.contestsParticipated || s.totalContests || 0;
        if (rating >= 2100) stats.badges.push({ type: "cf_master", label: "Codeforces Master", platform: "Codeforces" });
        else if (rating >= 1900) stats.badges.push({ type: "cf_candidate", label: "Codeforces Candidate Master", platform: "Codeforces" });
        else if (rating >= 1600) stats.badges.push({ type: "cf_expert", label: "Codeforces Expert", platform: "Codeforces" });
        break;
      case "github":
        const stars = s.totalStars || 0;
        if (stars >= 100) stats.badges.push({ type: "github_stars_100", label: "100+ GitHub Stars", platform: "GitHub" });
        if ((s.publicRepos || 0) >= 50) stats.badges.push({ type: "github_repos_50", label: "50+ Repositories", platform: "GitHub" });
        break;
      case "codechef":
        stats.totalProblemsSolved += solved;
        if (rating >= 2000) stats.badges.push({ type: "codechef_5star", label: "5★ CodeChef Coder", platform: "CodeChef" });
        break;
      case "atcoder":
        stats.totalProblemsSolved += solved;
        if (rating >= 1200) stats.badges.push({ type: "atcoder_cyan", label: "AtCoder Cyan", platform: "AtCoder" });
        break;
    }
  }

  if (stats.totalProblemsSolved >= 1000) {
    stats.badges.push({ type: "grandmaster_solver", label: "1000+ Total Problems", platform: "Global" });
  }

  return stats;
}

/**
 * Update public profile settings
 * PATCH /api/user/public-profile
 */
export const updatePublicProfile = catchAsync(async (req, res) => {
  const { enabled, username, showLeetCode, showCodeforces, showGitHub, showCodeChef, showAtCoder } = req.body;
  const updates = {};

  if (typeof enabled === "boolean") updates["publicProfile.enabled"] = enabled;

  if (username !== undefined) {
    if (username && !/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
      throw new ApiError(400, "Username must be 3-30 characters, alphanumeric with _ or -");
    }

    if (username) {
      const existing = await User.findOne({
        "publicProfile.username": username,
        _id: { $ne: req.user._id }
      }).lean();
      if (existing) throw new ApiError(400, "Username already taken");
    }
    updates["publicProfile.username"] = username || null;
  }

  const flags = { showLeetCode, showCodeforces, showGitHub, showCodeChef, showAtCoder };
  Object.keys(flags).forEach(key => {
    if (typeof flags[key] === "boolean") {
      updates[`publicProfile.${key}`] = flags[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true }
  ).select("publicProfile").lean();

  res.status(200).json(new ApiResponse(200, { publicProfile: user.publicProfile }, "Public profile updated"));
});

