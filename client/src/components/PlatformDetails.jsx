import React from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

/**
 * PlatformDetailsHeader - Reusable header component for platform detail pages
 */
export function PlatformDetailsHeader({
  platform,
  username,
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  isTextIcon = false,
  onUnlink
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between mb-10 fade-in-scale">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all hover:bg-blue-600 hover:border-blue-500 hover:-translate-x-1 group shadow-xl active:scale-95"
          title="Back to Dashboard"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="mb-12 fade-in-scale">
        <div className="flex items-center gap-8">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform"
            style={{
              backgroundColor: iconBgColor,
              boxShadow: `0 20px 40px ${iconBgColor}50`
            }}
          >
            {isTextIcon ? (
              <span className="text-2xl font-black text-white">{Icon}</span>
            ) : (
              <Icon className="text-white text-4xl" />
            )}
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2">
              {title} <span className="animate-text-shine">Profile</span>
            </h1>
            <p className="text-xl font-black tracking-widest uppercase" style={{ color: iconColor }}>
              @{username}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * StatBox - Reusable stat display box
 */
export function StatBox({
  label,
  value,
  valueColor = "text-white",
  subValue,
  subValueColor = "text-gray-500",
  colSpan = 1,
  className = ""
}) {
  return (
    <div className={`glass-card-premium p-8 ${colSpan > 1 ? `lg:col-span-${colSpan}` : ""} ${className}`}>
      <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
        {label}
      </div>
      <div className="flex items-end gap-3">
        <span className={`text-5xl font-black italic ${valueColor}`}>
          {value}
        </span>
        {subValue && (
          <span className={`font-black text-lg mb-2 ${subValueColor}`}>
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * SectionHeader - Reusable section header with animated dot
 */
export function SectionHeader({ title, dotColor = "bg-blue-500" }) {
  return (
    <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
      <div className={`w-2 h-2 ${dotColor} rounded-full animate-pulse`}></div>
      {title}
    </h2>
  );
}

/**
 * ContestHistoryList - Reusable contest history component
 */
export function ContestHistoryList({
  contests,
  platform,
  accentColor = "#3B82F6",
  maxItems = 10
}) {
  if (!contests || contests.length === 0) return null;

  return (
    <div className="mb-16">
      <SectionHeader title="Contest History" dotColor="bg-purple-500" />
      <div className="glass-card-premium p-6">
        <div className="space-y-2">
          {contests.slice(0, maxItems).map((contest, idx) => {
            const ratingChange = contest.newRating !== undefined
              ? contest.newRating - (contest.oldRating || 0)
              : null;
            const changeColor = ratingChange >= 0 ? "#22C55E" : "#EF4444";

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor
                    }}
                  >
                    #{contest.place || contest.rank}
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-[300px]">
                      {contest.contestName || contest.contestCode}
                    </div>
                    {contest.performance && (
                      <div className="text-xs text-gray-500">
                        Perf: <span className="text-purple-400">{contest.performance}</span>
                      </div>
                    )}
                    {contest.date && (
                      <div className="text-xs text-gray-500">{contest.date}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">
                    {Math.round(contest.newRating || contest.rating)}
                  </div>
                  {ratingChange !== null && (
                    <div
                      className="text-sm font-bold"
                      style={{ color: changeColor }}
                    >
                      {ratingChange >= 0 ? "+" : ""}{Math.round(ratingChange)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * DifficultyGrid - Reusable difficulty breakdown grid
 */
export function DifficultyGrid({ title, difficulties, dotColor = "bg-blue-500" }) {
  const difficultyConfig = {
    easy: { color: "#22C55E", label: "Easy" },
    medium: { color: "#EAB308", label: "Medium" },
    hard: { color: "#EF4444", label: "Hard" },
    challenge: { color: "#A855F7", label: "Challenge" },
    total: { color: "white", label: "Total" }
  };

  return (
    <div className="mb-16">
      <SectionHeader title={title} dotColor={dotColor} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(difficulties).map(([key, value]) => {
          const config = difficultyConfig[key] || { color: "#6B7280", label: key };
          return (
            <div
              key={key}
              className="glass-card-premium p-8"
              style={{ borderColor: `${config.color}20` }}
            >
              <div
                className="text-xs font-black uppercase tracking-widest mb-6"
                style={{ color: `${config.color}80` }}
              >
                {config.label}
              </div>
              <div
                className="text-5xl font-black italic"
                style={{ color: config.color }}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * LanguageStats - Reusable language statistics display
 */
export function LanguageStats({ languages, title = "Languages Used", dotColor = "bg-green-500" }) {
  if (!languages || Object.keys(languages).length === 0) return null;

  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const maxCount = Math.max(...sortedLanguages.map(([, count]) => count));

  return (
    <div className="mb-16">
      <SectionHeader title={title} dotColor={dotColor} />
      <div className="glass-card-premium p-6">
        <div className="space-y-4">
          {sortedLanguages.map(([lang, count]) => (
            <div key={lang} className="group">
              <div className="flex justify-between mb-2">
                <span className="text-white font-bold">{lang}</span>
                <span className="text-gray-400">{count}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all group-hover:opacity-80"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default {
  PlatformDetailsHeader,
  StatBox,
  SectionHeader,
  ContestHistoryList,
  DifficultyGrid,
  LanguageStats
};
