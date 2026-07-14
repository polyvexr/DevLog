import React from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiCalendar } from "react-icons/fi";

const AtCoderIcon = () => (
  <span className="font-bold text-[8px] text-[#e23e2d] bg-[#e23e2d]/10 px-1.5 py-0.5 rounded border border-[#e23e2d]/20 font-sans">AT</span>
);

export function PlatformDetailsHeader({ platform, username, icon: Icon, iconColor, iconBgColor, title, isTextIcon = false, onUnlink }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-white border border-slate-200 flex items-center justify-center text-lg">
          {isTextIcon ? <AtCoderIcon /> : <Icon className="text-slate-900" />}
        </div>
        <div>
          <h1 className="font-[Cormorant_Garamond] font-semibold italic text-slate-800 text-2xl leading-none">{title}</h1>
          <p className="font-mono text-[10px] text-slate-400 mt-1">@{username}</p>
        </div>
      </div>
      <button onClick={onUnlink} className="px-4 py-2 bg-red-50 border border-red-200 hover:bg-red-500 text-red-500 hover:text-white font-mono text-[9px] font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto">
        <FiTrash2 size={12} /> Disconnect
      </button>
    </div>
  );
}

export function StatBox({ label, value, valueColor = "text-slate-800", subValue, subValueColor = "text-slate-400", colSpan = 1, className = "", children }) {
  return (
    <div className={`bg-white border border-slate-200 p-5 rounded-xl space-y-2 relative ${colSpan > 1 ? `lg:col-span-${colSpan}` : ""} ${className}`}>
      <div className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-mono font-bold ${valueColor}`}>{value}</span>
        {subValue && <span className={`font-mono text-[10px] ${subValueColor}`}>{subValue}</span>}
      </div>
      {children}
    </div>
  );
}

export function SectionHeader({ title, dotColor = "bg-[#e23e2d]" }) {
  return (
    <div className="flex items-center gap-2 mb-6 mt-12 border-b border-slate-200 pb-3">
      <div className={`w-1.5 h-1.5 ${dotColor} rounded-full`}></div>
      <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-700">{title}</h2>
    </div>
  );
}

export function ContestHistoryList({ contests, platform, accentColor = "#e23e2d", maxItems = 10 }) {
  if (!contests || contests.length === 0) return null;
  return (
    <div className="mb-12">
      <SectionHeader title="Contest History" dotColor="bg-[#e23e2d]" />
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="divide-y divide-slate-200">
          {contests.slice(0, maxItems).map((contest, idx) => {
            const ratingChange = contest.newRating !== undefined ? contest.newRating - (contest.oldRating || 0) : null;
            const changeColorClass = ratingChange >= 0 ? "text-green-500" : "text-red-500";
            return (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[9px] text-[#e23e2d] font-bold">#{contest.place || contest.rank}</div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-slate-700 truncate pr-4">{contest.contestName || contest.contestCode}</div>
                    {contest.date && <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">{contest.date}</div>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-mono font-bold text-slate-800">{Math.round(contest.newRating || contest.rating)}</div>
                  {ratingChange !== null && <div className={`text-[9px] font-mono font-semibold ${changeColorClass}`}>{ratingChange >= 0 ? "+" : ""}{Math.round(ratingChange)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DifficultyGrid({ title, difficulties, dotColor = "bg-[#e23e2d]" }) {
  const difficultyConfig = {
    easy: { colorClass: "text-green-500", label: "Easy" },
    medium: { colorClass: "text-amber-500", label: "Medium" },
    hard: { colorClass: "text-red-500", label: "Hard" },
    challenge: { colorClass: "text-purple-500", label: "Challenge" },
    total: { colorClass: "text-slate-800", label: "Total" }
  };
  return (
    <div className="mb-12">
      <SectionHeader title={title} dotColor={dotColor} />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Object.entries(difficulties).map(([key, value]) => {
          const config = difficultyConfig[key] || { colorClass: "text-slate-500", label: key };
          return (
            <div key={key} className="bg-white border border-slate-200 p-5 rounded-xl space-y-2">
              <div className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-400">{config.label}</div>
              <div className={`text-3xl font-mono font-bold ${config.colorClass}`}>{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LanguageStats({ languages, title = "Languages Used", dotColor = "bg-[#e23e2d]" }) {
  if (!languages || Object.keys(languages).length === 0) return null;
  const sortedLanguages = Object.entries(languages).sort(([, a], [, b]) => b - a).slice(0, 8);
  const maxCount = Math.max(...sortedLanguages.map(([, count]) => count));
  return (
    <div className="mb-12">
      <SectionHeader title={title} dotColor={dotColor} />
      <div className="bg-white border border-slate-200 p-6 rounded-xl">
        <div className="space-y-4">
          {sortedLanguages.map(([lang, count]) => (
            <div key={lang} className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 font-semibold">{lang}</span>
                <span className="text-slate-400">{count}</span>
              </div>
              <div className="h-1.5 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#e23e2d] rounded-full transition-all" style={{ width: `${(count / maxCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default { PlatformDetailsHeader, StatBox, SectionHeader, ContestHistoryList, DifficultyGrid, LanguageStats };
