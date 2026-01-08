import React, { useState } from "react";
import {
  FiExternalLink,
  FiRefreshCw,
  FiStar,
  FiCode,
  FiAward,
  FiActivity,
  FiGitBranch,
  FiUsers,
  FiTrendingUp,
  FiTarget,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub } from "react-icons/si";

const platformConfig = {
  leetcode: {
    name: "LeetCode",
    icon: SiLeetcode,
    color: "#ffa116",
    gradient: "linear-gradient(135deg, #ffa116, #ffb84d)",
    url: (username) => `https://leetcode.com/u/${username}`,
    progressClass: "progress-fill-leetcode",
  },
  codeforces: {
    name: "Codeforces",
    icon: SiCodeforces,
    color: "#1f8acb",
    gradient: "linear-gradient(135deg, #1f8acb, #4cb3f0)",
    url: (username) => `https://codeforces.com/profile/${username}`,
    progressClass: "progress-fill-codeforces",
  },
  github: {
    name: "GitHub",
    icon: SiGithub,
    color: "#6e5494",
    gradient: "linear-gradient(135deg, #6e5494, #9575cd)",
    url: (username) => `https://github.com/${username}`,
    progressClass: "progress-fill-github",
  },
};

// Get stats to display based on platform
const getStatsDisplay = (platform, stats) => {
  if (!stats) return [];

  switch (platform) {
    case "leetcode": {
      const submissions = stats.submissionsByDifficulty || {};
      return [
        {
          label: "Problems Solved",
          value: stats.totalSolved || 0,
          icon: FiCheckCircle,
        },
        { label: "Easy", value: submissions.easy?.solved || 0, icon: FiTarget },
        { label: "Medium", value: submissions.medium?.solved || 0, icon: FiZap },
        { label: "Hard", value: submissions.hard?.solved || 0, icon: FiAward },
      ];
    }
    case "codeforces":
      return [
        { label: "Rating", value: stats.rating || 0, icon: FiTrendingUp },
        { label: "Rank", value: stats.rank || "N/A", icon: FiAward },
        { label: "Problems", value: stats.problemsSolved || 0, icon: FiCode },
        {
          label: "Contests",
          value: stats.totalContests || 0,
          icon: FiActivity,
        },
      ];
    case "github":
      return [
        {
          label: "Repositories",
          value: stats.publicRepos || 0,
          icon: FiGitBranch,
        },
        { label: "Followers", value: stats.followers || 0, icon: FiUsers },
        { label: "Stars", value: stats.totalStars || 0, icon: FiStar },
        {
          label: "Activity",
          value: stats.totalEvents || 0,
          icon: FiActivity,
        },
      ];
    default:
      return [];
  }
};

// Format time remaining
const formatTimeRemaining = (nextRefresh) => {
  if (!nextRefresh) return null;

  const now = new Date();
  const next = new Date(nextRefresh);
  const diffMs = next - now;

  if (diffMs <= 0) return null;

  const minutes = Math.ceil(diffMs / (60 * 1000));
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours}h ${remainingMins}m`;
};

const PlatformCard = ({
  platform,
  stats,
  username,
  progress = 0,
  canRefresh = true,
  nextRefreshAvailable,
  onRefresh,
  onClick,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const config = platformConfig[platform];
  if (!config) return null;

  const Icon = config.icon;
  const statsDisplay = getStatsDisplay(platform, stats);
  const timeRemaining = formatTimeRemaining(nextRefreshAvailable);

  const handleRefresh = async (e) => {
    e.stopPropagation();
    if (!canRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh(platform);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleVisit = (e) => {
    e.stopPropagation();
    window.open(config.url(username), "_blank");
  };

  return (
    <div className="platform-card cursor-pointer" onClick={onClick}>
      {/* Header */}
      <div className="platform-card-header">
        <div
          className="platform-card-icon"
          style={{ background: config.gradient }}
        >
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-[var(--text-primary)] font-semibold text-lg">
            {config.name}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm">@{username}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="platform-card-stats">
        {statsDisplay.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <div key={index} className="platform-card-stat">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <StatIcon size={14} className="text-[var(--text-secondary)]" />
                <span className="platform-card-stat-value">{stat.value}</span>
              </div>
              <div className="platform-card-stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="platform-card-progress">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--text-secondary)]">Progress</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {progress}%
          </span>
        </div>
        <div className="progress-container">
          <div
            className={`progress-fill ${config.progressClass}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="platform-card-actions">
        <button className="btn-secondary flex-1" onClick={handleVisit}>
          <FiExternalLink size={16} />
          Visit Platform
        </button>
        <div className="tooltip-container flex-1">
          <button
            className="btn-primary w-full"
            onClick={handleRefresh}
            disabled={!canRefresh || isRefreshing}
          >
            {isRefreshing ? (
              <div className="spinner" />
            ) : (
              <FiRefreshCw size={16} />
            )}
            {isRefreshing ? "Updating..." : "Update Stats"}
          </button>
          {!canRefresh && timeRemaining && (
            <div className="tooltip">Available in {timeRemaining}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformCard;
