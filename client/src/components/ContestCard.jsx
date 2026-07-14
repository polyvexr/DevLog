import React from "react";
import { FiClock, FiExternalLink, FiZap, FiCalendar } from "react-icons/fi";
import { FaCode } from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";

const AtCoderIcon = () => (
  <span className="font-bold text-[8px] text-[#e23e2d] bg-[#e23e2d]/10 px-1.5 py-0.5 rounded border border-[#e23e2d]/20 font-sans">AT</span>
);

const platformConfig = {
  leetcode: { name: "LeetCode", icon: SiLeetcode, colorClass: "text-orange-500" },
  codeforces: { name: "Codeforces", icon: SiCodeforces, colorClass: "text-blue-500" },
  codechef: { name: "CodeChef", icon: SiCodechef, colorClass: "text-amber-600" },
  atcoder: { name: "AtCoder", icon: AtCoderIcon, colorClass: "", isTextIcon: true },
};

export default function ContestCard({ contest }) {
  const config = platformConfig[contest.platform] || platformConfig.leetcode;
  const Icon = config.icon;
  const startTime = new Date(contest.startTime);
  const now = new Date();
  const diffMs = startTime - now;
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let timeUntil;
  let statusClass = "text-slate-500 border-slate-200";
  if (diffMs < 0) { timeUntil = "Live Now"; statusClass = "text-green-600 border-green-500/20"; }
  else if (diffHours < 1) { timeUntil = "Starting Soon"; statusClass = "text-red-500 border-red-500/20"; }
  else if (diffHours < 24) { timeUntil = `In ${diffHours}h`; statusClass = "text-amber-600 border-amber-500/20"; }
  else { timeUntil = `In ${diffDays}d`; statusClass = "text-slate-500 border-slate-200"; }

  const hours = Math.floor(contest.duration / 60);
  const minutes = contest.duration % 60;
  const durationStr = hours > 0 ? minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h` : `${minutes}m`;

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
    <div className="bg-white border border-slate-200 hover:border-slate-300 p-6 rounded-xl transition-all relative overflow-hidden group flex flex-col justify-between min-h-[190px]">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-sm">
              {config.isTextIcon ? <Icon /> : <Icon className={config.colorClass} />}
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">{config.name}</span>
              {contest.division && <span className="ml-1.5 font-mono text-[9px] text-slate-400">• {contest.division}</span>}
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider border bg-white ${statusClass}`}>{timeUntil}</span>
        </div>
        <h3 className="font-[Cormorant_Garamond] font-semibold italic text-slate-800 text-base leading-tight mt-4 mb-4 line-clamp-2">{contest.name}</h3>
      </div>
      <div className="flex items-center justify-between text-[9px] font-mono pt-3 border-t border-slate-200 mt-auto">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1"><FiCalendar className="text-[#e23e2d]" /><span>{startTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span></div>
          <div className="flex items-center gap-1"><FiClock /><span>{startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span></div>
        </div>
        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500">{durationStr}</span>
      </div>
      <div className="absolute inset-0 bg-white/95 border border-slate-200 flex flex-col justify-center gap-2.5 p-5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <a href={contest.url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-[9px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"><FiExternalLink size={12} /> Open Contest</a>
        <a href={getGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-slate-100 border border-slate-200 hover:bg-white text-slate-600 font-mono text-[9px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"><FiCalendar size={12} /> Add to Calendar</a>
      </div>
    </div>
  );
}
