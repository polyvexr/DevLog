import { FaCalendarAlt, FaClock, FaExternalLinkAlt, FaCode } from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";

/**
 * ContestCard - Displays upcoming contest with platform-specific styling
 */
export default function ContestCard({ contest }) {
  const platformConfig = {
    leetcode: {
      name: "LeetCode",
      icon: SiLeetcode,
      color: "#ffa116",
      bgGradient: "from-[#ffa116]/20 to-[#ffa116]/5",
      borderColor: "border-[#ffa116]/30",
    },
    codeforces: {
      name: "Codeforces",
      icon: SiCodeforces,
      color: "#1f8acb",
      bgGradient: "from-[#1f8acb]/20 to-[#1f8acb]/5",
      borderColor: "border-[#1f8acb]/30",
    },
    codechef: {
      name: "CodeChef",
      icon: SiCodechef,
      color: "#5b4638",
      bgGradient: "from-[#8b6914]/20 to-[#8b6914]/5",
      borderColor: "border-[#8b6914]/30",
    },
    atcoder: {
      name: "AtCoder",
      icon: FaCode,
      color: "#00a0e9",
      bgGradient: "from-[#00a0e9]/20 to-[#00a0e9]/5",
      borderColor: "border-[#00a0e9]/30",
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

  if (diffMs < 0) {
    timeUntil = "Ongoing";
    timeUntilClass = "text-green-400";
  } else if (diffHours < 1) {
    timeUntil = "Starting soon!";
    timeUntilClass = "text-red-400 animate-pulse";
  } else if (diffHours < 24) {
    timeUntil = `In ${diffHours}h`;
    timeUntilClass = "text-yellow-400";
  } else {
    timeUntil = `In ${diffDays}d`;
  }

  // Format duration
  const hours = Math.floor(contest.duration / 60);
  const minutes = contest.duration % 60;
  const durationStr = hours > 0 
    ? minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    : `${minutes}m`;

  return (
    <div
      className={`relative rounded-xl p-4 border bg-gradient-to-br ${config.bgGradient} ${config.borderColor} hover:scale-[1.02] transition-all duration-300 group`}
    >
      {/* Platform badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon style={{ color: config.color }} size={20} />
          <span className="text-xs font-medium text-gray-400">{config.name}</span>
        </div>
        <span className={`text-xs font-semibold ${timeUntilClass}`}>{timeUntil}</span>
      </div>

      {/* Contest name */}
      <h3 className="text-white font-semibold text-sm mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
        {contest.name}
      </h3>

      {/* Time and duration */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <FaCalendarAlt size={12} />
          <span>
            {startTime.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FaClock size={12} />
          <span>
            {startTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Duration badge */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">
          {durationStr}
        </span>
        
        {contest.division && (
          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
            {contest.division}
          </span>
        )}
      </div>

      {/* Link overlay */}
      <a
        href={contest.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-xl transition-opacity"
      >
        <span className="flex items-center gap-2 text-white text-sm font-medium">
          <FaExternalLinkAlt />
          Open Contest
        </span>
      </a>
    </div>
  );
}
