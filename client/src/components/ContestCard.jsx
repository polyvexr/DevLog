import { FiClock, FiExternalLink, FiZap, FiCalendar } from "react-icons/fi";
import { FaCode } from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";

/**
 * ContestCard - Premium contest display with platform-specific styling
 */
export default function ContestCard({ contest }) {
  const platformConfig = {
    leetcode: {
      name: "LeetCode",
      icon: SiLeetcode,
      color: "#ffa116",
      textColor: "text-orange-400",
      bgGradient: "from-orange-500/10 via-orange-500/5 to-transparent",
      borderColor: "border-orange-500/20",
      ringColor: "ring-orange-500/30",
      glowColor: "shadow-orange-500/10",
    },
    codeforces: {
      name: "Codeforces",
      icon: SiCodeforces,
      color: "#1f8acb",
      textColor: "text-blue-400",
      bgGradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      borderColor: "border-blue-500/20",
      ringColor: "ring-blue-500/30",
      glowColor: "shadow-blue-500/10",
    },
    codechef: {
      name: "CodeChef",
      icon: SiCodechef,
      color: "#8b6914",
      textColor: "text-amber-400",
      bgGradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      borderColor: "border-amber-500/20",
      ringColor: "ring-amber-500/30",
      glowColor: "shadow-amber-500/10",
    },
    atcoder: {
      name: "AtCoder",
      icon: FaCode,
      color: "#00a0e9",
      textColor: "text-cyan-400",
      bgGradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
      borderColor: "border-cyan-500/20",
      ringColor: "ring-cyan-500/30",
      glowColor: "shadow-cyan-500/10",
    },
  };

  const config = platformConfig[contest.platform] || platformConfig.leetcode;
  const Icon = config.icon;

  // Calculate time until contest
  const startTime = new Date(contest.startTime);
  const now = new Date();
  const diffMs = startTime - now;
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let timeUntil;
  let timeUntilClass = "text-gray-400";
  let statusBg = "bg-gray-500/10";
  let isUrgent = false;

  if (diffMs < 0) {
    timeUntil = "Live Now";
    timeUntilClass = "text-green-400";
    statusBg = "bg-green-500/20 border-green-500/30";
    isUrgent = true;
  } else if (diffHours < 1) {
    timeUntil = "Starting Soon";
    timeUntilClass = "text-red-400";
    statusBg = "bg-red-500/20 border-red-500/30";
    isUrgent = true;
  } else if (diffHours < 24) {
    timeUntil = `In ${diffHours}h`;
    timeUntilClass = "text-yellow-400";
    statusBg = "bg-yellow-500/20 border-yellow-500/30";
  } else {
    timeUntil = `In ${diffDays}d`;
    statusBg = "bg-gray-500/10 border-gray-500/20";
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
    const duration = contest.duration || 120; // Default to 2 hours if missing
    const end = new Date(start.getTime() + (duration * 60000));

    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const title = encodeURIComponent(`${config.name}: ${contest.name}`);
    const details = encodeURIComponent(`Platform: ${config.name}\nDuration: ${durationStr}\nContest URL: ${contest.url}\n\nTracked via DevLog Arena`);
    const dates = `${formatDate(start)}/${formatDate(end)}`;

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${encodeURIComponent(contest.url)}`;
  };

  return (
    <div
      className={`glass-card-premium relative overflow-hidden p-6 border-none ring-1 ring-white/5 hover:ring-2 ${config.ringColor} transition-all duration-300 group hover:scale-[1.02] ${isUrgent ? 'animate-pulse-slow' : ''}`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.borderColor} border bg-black/20`}>
              <Icon style={{ color: config.color }} size={18} />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${config.textColor}`}>
                {config.name}
              </span>
              {contest.division && (
                <span className="ml-2 text-[10px] font-bold text-gray-500">
                  • {contest.division}
                </span>
              )}
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBg} ${timeUntilClass}`}>
            {timeUntil}
          </span>
        </div>

        {/* Contest name */}
        <h3 className="text-lg font-black text-white mb-4 line-clamp-2 group-hover:text-white/90 transition-colors italic">
          {contest.name}
        </h3>

        {/* Time and duration */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <FiZap size={14} className={config.textColor} />
              <span className="font-bold">
                {startTime.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <FiClock size={14} />
              <span className="font-bold">
                {startTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-white/5 text-gray-300 font-bold text-[10px] uppercase tracking-wider">
            {durationStr}
          </span>
        </div>
      </div>

      {/* Hover overlay - Actions */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-sm transition-all duration-300 z-20 p-6">
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 text-white font-black text-sm px-6 py-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all active:scale-95"
        >
          <FiExternalLink className="text-lg" />
          Open Contest
        </a>
        <a
          href={getGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 text-white font-black text-sm px-6 py-4 bg-blue-600/20 rounded-2xl border border-blue-500/30 hover:bg-blue-600 hover:scale-105 transition-all active:scale-95 text-blue-400 hover:text-white shadow-lg shadow-blue-500/10"
        >
          <FiCalendar className="text-lg" />
          Add to Calendar
        </a>
      </div>
    </div>
  );
}
