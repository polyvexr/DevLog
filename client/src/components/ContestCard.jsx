import React from "react";
import { FiClock, FiExternalLink, FiZap, FiCalendar } from "react-icons/fi";
import { FaCode } from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";

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
  },
  codeforces: {
    name: "Codeforces",
    icon: SiCodeforces,
    colorClass: "text-blue-500",
  },
  codechef: {
    name: "CodeChef",
    icon: SiCodechef,
    colorClass: "text-amber-600",
  },
  atcoder: {
    name: "AtCoder",
    icon: AtCoderIcon,
    colorClass: "",
    isTextIcon: true,
  },
};

export default function ContestCard({ contest }) {
  const config = platformConfig[contest.platform] || platformConfig.leetcode;
  const Icon = config.icon;

  // Calculate time until contest
  const startTime = new Date(contest.startTime);
  const now = new Date();
  const diffMs = startTime - now;
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let timeUntil;
  let statusClass = "text-slate-400 border-slate-500/10";

  if (diffMs < 0) {
    timeUntil = "Live Now";
    statusClass = "text-green-500 border-green-500/20";
  } else if (diffHours < 1) {
    timeUntil = "Starting Soon";
    statusClass = "text-red-500 border-red-500/20";
  } else if (diffHours < 24) {
    timeUntil = `In ${diffHours}h`;
    statusClass = "text-amber-500 border-amber-500/20";
  } else {
    timeUntil = `In ${diffDays}d`;
    statusClass = "text-slate-400 border-slate-500/10";
  }

  // Format duration
  const hours = Math.floor(contest.duration / 60);
  const minutes = contest.duration % 60;
  const durationStr = hours > 0
    ? minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    : `${minutes}m`;

  // Create Google Calendar URL
  const getGoogleCalendarUrl = () => {
    const start = new Date(contest.startTime);
    const duration = contest.duration || 120;
    const end = new Date(start.getTime() + (duration * 60000));
    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const title = encodeURIComponent(`${config.name}: ${contest.name}`);
    const details = encodeURIComponent(`Platform: ${config.name}\nDuration: ${durationStr}\nContest URL: ${contest.url}\n\nTracked via DevLog Arena`);
    const dates = `${formatDate(start)}/${formatDate(end)}`;

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${encodeURIComponent(contest.url)}`;
  };

  return (
    <div className="bg-[#121214] border border-[#222225] hover:border-neutral-700 p-6 rounded-xl transition-all relative overflow-hidden group flex flex-col justify-between min-h-[190px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#0c0c0c] border border-[#222225] flex items-center justify-center text-sm">
              {config.isTextIcon ? <Icon /> : <Icon className={config.colorClass} />}
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                {config.name}
              </span>
              {contest.division && (
                <span className="ml-1.5 font-mono text-[9px] text-slate-600">
                  • {contest.division}
                </span>
              )}
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider border bg-[#0c0c0c] ${statusClass}`}>
            {timeUntil}
          </span>
        </div>

        {/* Contest Name */}
        <h3 className="font-[Cormorant_Garamond] font-semibold italic text-slate-100 text-base leading-tight mt-4 mb-4 line-clamp-2">
          {contest.name}
        </h3>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[9px] font-mono pt-3 border-t border-[#222225]/40 mt-auto">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="flex items-center gap-1">
            <FiCalendar className="text-[#e23e2d]" />
            <span>
              {startTime.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock />
            <span>
              {startTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-[#0c0c0c] border border-[#222225] rounded text-slate-400">
          {durationStr}
        </span>
      </div>

      {/* Actions (Hover Overlay) */}
      <div className="absolute inset-0 bg-[#121214]/95 border border-[#222225] flex flex-col justify-center gap-2.5 p-5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-[9px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FiExternalLink size={12} />
          Open Contest
        </a>
        <a
          href={getGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 bg-[#0c0c0c] border border-[#222225] hover:bg-[#121214] text-slate-300 font-mono text-[9px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FiCalendar size={12} />
          Add to Calendar
        </a>
      </div>
    </div>
  );
}
