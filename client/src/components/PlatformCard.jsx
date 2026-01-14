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
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

// AtCoder text icon component
const AtCoderIcon = ({ className }) => (
  <span className={`font-black text-sm ${className}`}>AT</span>
);

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
  codechef: {
    name: "CodeChef",
    icon: SiCodechef,
    color: "#5B4638",
    gradient: "linear-gradient(135deg, #5B4638, #8B7355)",
    url: (username) => `https://www.codechef.com/users/${username}`,
    progressClass: "progress-fill-codechef",
  },
  atcoder: {
    name: "AtCoder",
    icon: AtCoderIcon,
    color: "#222222",
    gradient: "linear-gradient(135deg, #333333, #666666)",
    url: (username) => `https://atcoder.jp/users/${username}`,
    progressClass: "progress-fill-atcoder",
    isTextIcon: true,
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
    case "codechef":
      return [
        { label: "Rating", value: stats.rating || 0, icon: FiTrendingUp },
        { label: "Stars", value: "★".repeat(stats.stars || 1), icon: FiStar },
        { label: "Solved", value: stats.totalSolved || 0, icon: FiCheckCircle },
        { label: "Global Rank", value: stats.globalRank ? `#${stats.globalRank}` : "N/A", icon: FiAward },
      ];
    case "atcoder":
      return [
        { label: "Rating", value: stats.rating || 0, icon: FiTrendingUp },
        { label: "Rank Color", value: stats.rankColor || "Unrated", icon: FiAward },
        { label: "Solved", value: stats.totalSolved || stats.acCount || 0, icon: FiCheckCircle },
        { label: "Contests", value: stats.contestsParticipated || 0, icon: FiActivity },
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
    <div 
      className="glass-card-premium p-8 cursor-pointer group hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3"
          style={{ background: config.gradient, boxShadow: `0 10px 30px -5px ${config.color}40` }}
        >
          {config.isTextIcon ? (
            <Icon className="text-white" />
          ) : (
            <Icon className="text-white" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-black text-white group-hover:text-white/90">
            {config.name}
          </h3>
          <p className="text-blue-400 font-bold tracking-tight">@{username}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {statsDisplay.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-4 group-hover:border-white/10 transition-all">
              <div className="flex items-center gap-2 mb-1.5 overflow-hidden">
                <StatIcon size={14} className="text-gray-500 group-hover:translate-y-0 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{stat.label}</span>
              </div>
              <div className="text-xl font-black text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-widest text-gray-500">Mastery Progress</span>
          <span className="text-sm font-black text-white">
            {progress}%
          </span>
        </div>
        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
            style={{ 
              width: `${progress}%`,
              background: config.gradient
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button 
          className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          onClick={handleVisit}
        >
          <FiExternalLink size={14} />
          Profile
        </button>
        <div className="flex-1 relative">
          <button
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            onClick={handleRefresh}
            disabled={!canRefresh || isRefreshing}
          >
            {isRefreshing ? (
              <FiRefreshCw size={14} className="animate-spin" />
            ) : (
              <FiZap size={14} className="group-hover:animate-pulse" />
            )}
            {isRefreshing ? "Syncing..." : "Sync Stats"}
          </button>
          {!canRefresh && timeRemaining && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur rounded text-[10px] font-bold text-blue-400 whitespace-nowrap border border-blue-500/30">
              Cooldown: {timeRemaining}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformCard;
