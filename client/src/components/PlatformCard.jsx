import React, { useState } from "react";
import { FiExternalLink, FiRefreshCw, FiStar, FiCode, FiAward, FiActivity, FiGitBranch, FiUsers, FiTrendingUp, FiTarget, FiZap, FiCheckCircle } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

const AtCoderIcon = () => (
  <span className="font-bold text-[8px] text-[#e23e2d] bg-[#e23e2d]/10 px-1.5 py-0.5 rounded border border-[#e23e2d]/20 font-sans">AT</span>
);

const platformConfig = {
  leetcode: { name: "LeetCode", icon: SiLeetcode, colorClass: "text-orange-500", url: (username) => `https://leetcode.com/u/${username}` },
  codeforces: { name: "Codeforces", icon: SiCodeforces, colorClass: "text-blue-500", url: (username) => `https://codeforces.com/profile/${username}` },
  github: { name: "GitHub", icon: SiGithub, colorClass: "text-slate-700", url: (username) => `https://github.com/${username}` },
  codechef: { name: "CodeChef", icon: SiCodechef, colorClass: "text-amber-600", url: (username) => `https://www.codechef.com/users/${username}` },
  atcoder: { name: "AtCoder", icon: AtCoderIcon, colorClass: "", url: (username) => `https://atcoder.jp/users/${username}`, isTextIcon: true },
};

const getStatsDisplay = (platform, stats) => {
  if (!stats) return [];
  switch (platform) {
    case "leetcode": { const ranking = stats.contestRanking || {}; return [{ label: "Solved", value: stats.totalSolved || 0, icon: FiCheckCircle }, { label: "Rating", value: ranking.rating ? Math.round(ranking.rating) : "Unrated", icon: FiTrendingUp }, { label: "Percentile", value: ranking.topPercentage ? `${ranking.topPercentage}%` : "N/A", icon: FiTarget }, { label: "Contests", value: ranking.attendedContestsCount || 0, icon: FiActivity }]; }
    case "codeforces": return [{ label: "Rating", value: stats.rating || 0, icon: FiTrendingUp }, { label: "Rank", value: stats.rank || "N/A", icon: FiAward }, { label: "Problems", value: stats.problemsSolved || 0, icon: FiCode }, { label: "Contests", value: stats.totalContests || 0, icon: FiActivity }];
    case "github": return [{ label: "Repositories", value: stats.publicRepos || 0, icon: FiGitBranch }, { label: "Followers", value: stats.followers || 0, icon: FiUsers }, { label: "Stars", value: stats.totalStars || 0, icon: FiStar }, { label: "Activity", value: stats.totalEvents || 0, icon: FiActivity }];
    case "codechef": return [{ label: "Rating", value: stats.rating || 0, icon: FiTrendingUp }, { label: "Stars", value: "★".repeat(stats.stars || 1), icon: FiStar }, { label: "Solved", value: stats.totalSolved || 0, icon: FiCheckCircle }, { label: "Global Rank", value: stats.globalRank ? `#${stats.globalRank}` : "N/A", icon: FiAward }];
    case "atcoder": return [{ label: "Rating", value: stats.rating || 0, icon: FiTrendingUp }, { label: "Rank Color", value: stats.rankColor || "Unrated", icon: FiAward }, { label: "Solved", value: stats.totalSolved || stats.acCount || 0, icon: FiCheckCircle }, { label: "Contests", value: stats.contestsParticipated || 0, icon: FiActivity }];
    default: return [];
  }
};

const PlatformCard = ({ platform, stats, username, onClick }) => {
  const config = platformConfig[platform];
  if (!config) return null;
  const Icon = config.icon;
  const statsDisplay = getStatsDisplay(platform, stats);

  const handleVisit = (e) => { e.stopPropagation(); window.open(config.url(username), "_blank"); };

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 p-6 rounded-xl transition-all cursor-pointer flex flex-col justify-between min-h-[280px]" onClick={onClick}>
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">
            {config.isTextIcon ? <Icon /> : <Icon className={config.colorClass} />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-[Cormorant_Garamond] font-semibold italic text-slate-800 text-lg leading-tight truncate">{config.name}</h3>
            <p className="font-mono text-[10px] text-slate-400 truncate">@{username}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statsDisplay.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="bg-slate-100 border border-slate-200 rounded p-3 space-y-1">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <StatIcon size={11} className="text-slate-400" />
                  <span className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-400">{stat.label}</span>
                </div>
                <div className="text-sm font-mono font-bold text-slate-700 truncate">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-3">
        <button className="flex-grow py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-[9px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer" onClick={handleVisit}>
          <FiExternalLink size={12} /> Profile
        </button>
      </div>
    </div>
  );
};

export default PlatformCard;
