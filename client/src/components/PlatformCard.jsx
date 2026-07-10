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

const AtCoderIcon = () => (
  <span className="font-bold text-[8px] text-[#e23e2d] bg-[#e23e2d]/10 px-1.5 py-0.5 rounded border border-[#e23e2d]/20 font-sans">
    AT
  </span>
);

const platformConfig = {
  leetcode: {
    name: "LeetCode",
    icon: SiLeetcode,
    colorClass: "text-orange-500",
    url: (username) => `https://leetcode.com/u/${username}`,
  },
  codeforces: {
    name: "Codeforces",
    icon: SiCodeforces,
    colorClass: "text-blue-500",
    url: (username) => `https://codeforces.com/profile/${username}`,
  },
  github: {
    name: "GitHub",
    icon: SiGithub,
    colorClass: "text-slate-200",
    url: (username) => `https://github.com/${username}`,
  },
  codechef: {
    name: "CodeChef",
    icon: SiCodechef,
    colorClass: "text-amber-600",
    url: (username) => `https://www.codechef.com/users/${username}`,
  },
  atcoder: {
    name: "AtCoder",
    icon: AtCoderIcon,
    colorClass: "",
    url: (username) => `https://atcoder.jp/users/${username}`,
    isTextIcon: true,
  },
};

const getStatsDisplay = (platform, stats) => {
  if (!stats) return [];

  switch (platform) {
    case "leetcode": {
      const ranking = stats.contestRanking || {};
      return [
        { label: "Solved", value: stats.totalSolved || 0, icon: FiCheckCircle },
        { label: "Rating", value: ranking.rating ? Math.round(ranking.rating) : "Unrated", icon: FiTrendingUp },
        { label: "Percentile", value: ranking.topPercentage ? `${ranking.topPercentage}%` : "N/A", icon: FiTarget },
        { label: "Contests", value: ranking.attendedContestsCount || 0, icon: FiActivity },
      ];
    }
    case "codeforces":
      return [
        { label: "Rating", value: stats.rating || 0, icon: FiTrendingUp },
        { label: "Rank", value: stats.rank || "N/A", icon: FiAward },
        { label: "Problems", value: stats.problemsSolved || 0, icon: FiCode },
        { label: "Contests", value: stats.totalContests || 0, icon: FiActivity },
      ];
    case "github":
      return [
        { label: "Repositories", value: stats.publicRepos || 0, icon: FiGitBranch },
        { label: "Followers", value: stats.followers || 0, icon: FiUsers },
        { label: "Stars", value: stats.totalStars || 0, icon: FiStar },
        { label: "Activity", value: stats.totalEvents || 0, icon: FiActivity },
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
      className="bg-[#121214] border border-[#222225] hover:border-neutral-700 p-6 rounded-xl transition-all cursor-pointer flex flex-col justify-between min-h-[280px]"
      onClick={onClick}
    >
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-[#0c0c0c] border border-[#222225] flex items-center justify-center text-lg">
            {config.isTextIcon ? (
              <Icon />
            ) : (
              <Icon className={config.colorClass} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-[Cormorant_Garamond] font-semibold italic text-slate-100 text-lg leading-tight truncate">
              {config.name}
            </h3>
            <p className="font-mono text-[10px] text-slate-500 truncate">@{username}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statsDisplay.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="bg-[#0c0c0c] border border-[#222225] rounded p-3 space-y-1">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <StatIcon size={11} className="text-slate-600" />
                  <span className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-500">{stat.label}</span>
                </div>
                <div className="text-sm font-mono font-bold text-slate-200 truncate">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          className="flex-1 py-2.5 bg-[#121214] border border-[#222225] hover:bg-[#1c1c1f] text-slate-300 font-mono text-[9px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          onClick={handleVisit}
        >
          <FiExternalLink size={12} />
          Profile
        </button>
        <div className="flex-1 relative">
          <button
            className="w-full py-2.5 bg-[#e23e2d] hover:bg-[#cf2e2e] disabled:bg-red-950/50 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-mono text-[9px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            onClick={handleRefresh}
            disabled={!canRefresh || isRefreshing}
          >
            {isRefreshing ? (
              <FiRefreshCw size={12} className="animate-spin" />
            ) : (
              <FiZap size={12} />
            )}
            {isRefreshing ? "Syncing" : "Sync Stats"}
          </button>
          {!canRefresh && timeRemaining && (
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0c0c0c] border border-red-500/20 text-[#e23e2d] rounded text-[8px] font-mono whitespace-nowrap shadow-lg">
              Cooldown: {timeRemaining}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformCard;
