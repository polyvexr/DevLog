import { useState, useEffect, useCallback } from "react";
import { FiCalendar, FiClock, FiExternalLink, FiRefreshCw, FiFilter, FiZap } from "react-icons/fi";
import { FaCode } from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import ContestCard from "../components/ContestCard";
import FullPageLoader from "../components/FullPageLoader";
import api from "../api/axios";

/**
 * Contests Page - Premium contest calendar with filters
 */
export default function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "leetcode",
    "codeforces",
    "codechef",
    "atcoder",
  ]);

  const platforms = [
    { id: "leetcode", name: "LeetCode", icon: SiLeetcode, color: "#ffa116", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/20", ringColor: "ring-orange-500/40" },
    { id: "codeforces", name: "Codeforces", icon: SiCodeforces, color: "#1f8acb", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20", ringColor: "ring-blue-500/40" },
    { id: "codechef", name: "CodeChef", icon: SiCodechef, color: "#8b6914", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20", ringColor: "ring-amber-500/40" },
    { id: "atcoder", name: "AtCoder", icon: FaCode, color: "#00a0e9", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/20", ringColor: "ring-cyan-500/40" },
  ];

  const fetchContests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contests?platforms=${selectedPlatforms.join(",")}&days=60`);
      if (response.data.success) {
        setContests(response.data.contests);
      }
      setError(null);
    } catch {
      setError("Failed to load contests");
    } finally {
      setLoading(false);
    }
  }, [selectedPlatforms]);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformId)) {
        // Don't allow deselecting all
        if (prev.length === 1) return prev;
        return prev.filter((p) => p !== platformId);
      }
      return [...prev, platformId];
    });
  };

  // Group contests by date
  const groupedContests = contests.reduce((groups, contest) => {
    const date = new Date(contest.startTime).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(contest);
    return groups;
  }, {});

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Get relative time label for date headers
  const getDateBadge = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: "Live Now", color: "bg-green-500/20 text-green-400 border-green-500/30" };
    if (diffDays === 1) return { label: "Tomorrow", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    if (diffDays <= 3) return { label: "This Week", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    return { label: `In ${diffDays} days`, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
  };

  if (loading && contests.length === 0) return <FullPageLoader />;

  return (
    <>
      <div className="flex items-center justify-between mb-8 fade-in-scale">
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

      {/* Hero Header */}
      <div className="mb-12 fade-in-scale">
        <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tight">
          <span className="text-white opacity-90">Contest</span>
          <br />
          <span className="animate-text-shine inline-block">Arena</span>
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl font-medium max-w-2xl leading-relaxed">
          Track upcoming competitive programming battles across the global ecosystem.
        </p>
      </div>

      {/* Platform Filter Section */}
      <div className="glass-card-premium p-8 mb-10 fade-in-up border-none ring-1 ring-white/5">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-inner">
            <FiFilter className="text-2xl text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white italic">Ecosystem Filter</h2>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Select Platforms to Monitor</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatforms.includes(platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`group flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all active:scale-95 ${isSelected
                  ? `${platform.bgColor} ${platform.borderColor} ring-2 ${platform.ringColor}`
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
              >
                <Icon
                  size={20}
                  style={{ color: isSelected ? platform.color : "#6b7280" }}
                  className="transition-colors"
                />
                <span className={`font-bold text-sm ${isSelected ? "text-white" : "text-gray-400"}`}>
                  {platform.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="glass-card-premium p-16 md:p-24 text-center fade-in-up">
          <div className="w-24 h-24 bg-red-600/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <FiCalendar className="text-5xl text-red-500" />
          </div>
          <h3 className="text-4xl font-black mb-4 text-white italic">
            Connection <span className="text-red-500">Failed</span>
          </h3>
          <p className="text-gray-500 text-xl max-w-md mx-auto mb-12 font-medium leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchContests}
            className="px-10 py-5 bg-purple-600 hover:bg-purple-500 text-white font-black text-lg rounded-2xl transition-all shadow-2xl shadow-purple-500/30 active:scale-95 group flex items-center gap-3 mx-auto"
          >
            <FiRefreshCw className="text-xl group-hover:rotate-180 transition-transform duration-500" />
            Retry Connection
          </button>
        </div>
      ) : contests.length === 0 ? (
        <div className="glass-card-premium p-16 md:p-24 text-center fade-in-up">
          <div className="w-24 h-24 bg-purple-600/10 border border-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl pulse-ring">
            <FiCalendar className="text-5xl text-purple-500" />
          </div>
          <h3 className="text-4xl font-black mb-4 text-white italic">
            Arena <span className="text-gray-600">Empty</span>
          </h3>
          <p className="text-gray-500 text-xl max-w-md mx-auto mb-12 font-medium leading-relaxed">
            No upcoming contests detected in the selected ecosystems. Try expanding your filter range.
          </p>
          <button
            onClick={() => setSelectedPlatforms(["leetcode", "codeforces", "codechef", "atcoder"])}
            className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black text-lg rounded-2xl transition-all border border-white/10 active:scale-95"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-up">
            <div className="glass-card-premium p-6 text-center border-none ring-1 ring-white/5">
              <div className="text-3xl font-black text-white mb-1">{contests.length}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Events</div>
            </div>
            <div className="glass-card-premium p-6 text-center border-none ring-1 ring-white/5">
              <div className="text-3xl font-black text-orange-400 mb-1">
                {contests.filter(c => c.platform === "leetcode").length}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">LeetCode</div>
            </div>
            <div className="glass-card-premium p-6 text-center border-none ring-1 ring-white/5">
              <div className="text-3xl font-black text-blue-400 mb-1">
                {contests.filter(c => c.platform === "codeforces").length}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Codeforces</div>
            </div>
            <div className="glass-card-premium p-6 text-center border-none ring-1 ring-white/5">
              <div className="text-3xl font-black text-cyan-400 mb-1">
                {contests.filter(c => ["codechef", "atcoder"].includes(c.platform)).length}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Others</div>
            </div>
          </div>

          {/* Grouped Contests */}
          {Object.entries(groupedContests).map(([date, dateContests], groupIndex) => {
            const badge = getDateBadge(date);
            return (
              <div key={date} className={`fade-in-up`} style={{ animationDelay: `${groupIndex * 100}ms` }}>
                {/* Date header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                    <FiZap className="text-xl text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-white italic">{formatDateHeader(date)}</h2>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                      {dateContests.length} Event{dateContests.length > 1 ? "s" : ""} Scheduled
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Contest grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dateContests.map((contest) => (
                    <ContestCard key={contest._id} contest={contest} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
