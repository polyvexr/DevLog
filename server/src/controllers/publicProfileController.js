import User from "../models/User.js";
import PlatformStat from "../models/PlatformStat.js";

/**
 * Public Profile Controller - Unauthenticated public developer profiles
 */

/**
 * GET /u/:username
 * Get public profile by username (no auth required)
 */
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    // Find user by public profile username
    const user = await User.findOne({
      "publicProfile.username": username,
      "publicProfile.enabled": true
    }).select("name profile publicProfile createdAt");

    if (!user) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Get platform stats based on privacy settings
    const platformsToShow = [];
    if (user.publicProfile.showLeetCode) platformsToShow.push("leetcode");
    if (user.publicProfile.showCodeforces) platformsToShow.push("codeforces");
    if (user.publicProfile.showGitHub) platformsToShow.push("github");
    if (user.publicProfile.showCodeChef) platformsToShow.push("codechef");
    if (user.publicProfile.showAtCoder) platformsToShow.push("atcoder");

    const platformStats = await PlatformStat.find({
      userId: user._id,
      platform: { $in: platformsToShow }
    }).select("platform username data stats lastUpdated");

    // Find LeetCode stat for fallback avatar
    const leetCodeStat = platformStats.find(p => p.platform === "leetcode");
    // Calculate aggregate stats
    const aggregateStats = calculateAggregateStats(platformStats);

    res.json({
      success: true,
      profile: {
        name: user.name,
        username: user.publicProfile.username,
        avatar: user.profile?.avatar || leetCodeStat?.data?.avatar || "",
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
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    switch (ps.platform) {
      case "leetcode":
        stats.totalProblemsSolved += ps.stats?.totalSolved || 0;
        // Add badge for high problem count
        if ((ps.stats?.totalSolved || 0) >= 500) {
          stats.badges.push({ type: "leetcode_500", label: "500+ LeetCode Problems", platform: "LeetCode" });
        }
        if ((ps.stats?.hardSolved || 0) >= 100) {
          stats.badges.push({ type: "leetcode_hard_100", label: "100+ Hard Problems", platform: "LeetCode" });
        }
        break;
      case "codeforces":
        stats.totalContests += ps.stats?.contestsParticipated || ps.stats?.totalContests || 0;
        const cfRating = ps.stats?.rating || 0;
        // Add rank badges
        if (cfRating >= 2100) {
          stats.badges.push({ type: "cf_master", label: "Codeforces Master", platform: "Codeforces" });
        } else if (cfRating >= 1900) {
          stats.badges.push({ type: "cf_candidate", label: "Codeforces Candidate Master", platform: "Codeforces" });
        } else if (cfRating >= 1600) {
          stats.badges.push({ type: "cf_expert", label: "Codeforces Expert", platform: "Codeforces" });
        }
        break;
      case "github":
        const stars = ps.stats?.totalStars || 0;
        if (stars >= 100) {
          stats.badges.push({ type: "github_stars_100", label: "100+ GitHub Stars", platform: "GitHub" });
        }
        if ((ps.stats?.publicRepos || 0) >= 50) {
          stats.badges.push({ type: "github_repos_50", label: "50+ Repositories", platform: "GitHub" });
        }
        break;
      case "codechef":
        stats.totalProblemsSolved += ps.stats?.totalSolved || 0;
        const chefRating = ps.stats?.rating || 0;
        if (chefRating >= 2000) {
          stats.badges.push({ type: "codechef_5star", label: "5★ CodeChef Coder", platform: "CodeChef" });
        }
        break;
      case "atcoder":
        stats.totalProblemsSolved += ps.stats?.acCount || ps.stats?.totalSolved || 0;
        const atRating = ps.stats?.rating || 0;
        if (atRating >= 1200) {
          stats.badges.push({ type: "atcoder_cyan", label: "AtCoder Cyan", platform: "AtCoder" });
        }
        break;
    }
  }

  // Common high-level badges
  if (stats.totalProblemsSolved >= 1000) {
    stats.badges.push({ type: "grandmaster_solver", label: "1000+ Total Problems", platform: "Global" });
  }

  return stats;
}

/**
 * PATCH /api/user/public-profile
 * Update public profile settings (authenticated)
 */
export const updatePublicProfile = async (req, res) => {
  try {
    const { enabled, username, showLeetCode, showCodeforces, showGitHub } = req.body;

    const updates = {};

    if (typeof enabled === "boolean") {
      updates["publicProfile.enabled"] = enabled;
    }

    if (username !== undefined) {
      // Validate username format
      if (username && !/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
        return res.status(400).json({
          error: "Username must be 3-30 characters, alphanumeric with _ or -"
        });
      }

      // Check if username is taken
      if (username) {
        const existing = await User.findOne({
          "publicProfile.username": username,
          _id: { $ne: req.user._id }
        });
        if (existing) {
          return res.status(400).json({ error: "Username already taken" });
        }
      }

      updates["publicProfile.username"] = username || null;
    }

    if (typeof showLeetCode === "boolean") {
      updates["publicProfile.showLeetCode"] = showLeetCode;
    }
    if (typeof showCodeforces === "boolean") {
      updates["publicProfile.showCodeforces"] = showCodeforces;
    }
    if (typeof showGitHub === "boolean") {
      updates["publicProfile.showGitHub"] = showGitHub;
    }
    if (typeof showCodeChef === "boolean") {
      updates["publicProfile.showCodeChef"] = showCodeChef;
    }
    if (typeof showAtCoder === "boolean") {
      updates["publicProfile.showAtCoder"] = showAtCoder;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select("publicProfile");

    res.json({ success: true, publicProfile: user.publicProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
