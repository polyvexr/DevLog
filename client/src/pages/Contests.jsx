import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiRefreshCw, FiFilter } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import ContestCard from "../components/ContestCard";
import FullPageLoader from "../components/FullPageLoader";
import api from "../api/axios";

const AtCoderIcon = ({ isSelected }) => (
  <span className={`font-bold text-[8px] px-1.5 py-0.5 rounded border font-sans transition-colors ${
    isSelected
      ? "text-white bg-white/10 border-white/20"
      : "text-[#e23e2d] bg-[#e23e2d]/10 border-[#e23e2d]/20"
  }`}>
    AT
  </span>
);

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
    { id: "leetcode", name: "LeetCode", icon: SiLeetcode, colorClass: "text-orange-500" },
    { id: "codeforces", name: "Codeforces", icon: SiCodeforces, colorClass: "text-blue-500" },
    { id: "codechef", name: "CodeChef", icon: SiCodechef, colorClass: "text-amber-600" },
    { id: "atcoder", name: "AtCoder", icon: AtCoderIcon, colorClass: "" },
  ];

  const fetchContests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contests?platforms=${selectedPlatforms.join(",")}&days=60`);
      if (response.data.success) {
        setContests(response.data.data?.contests || []);
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
        if (prev.length === 1) return prev;
        return prev.filter((p) => p !== platformId);
      }
      return [...prev, platformId];
    });
  };

  const groupedContests = contests?.reduce((groups, contest) => {
    const date = new Date(contest.startTime).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(contest);
    return groups;
  }, {}) || {};

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

  const getDateBadge = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: "Live Now", color: "bg-green-500/10 text-green-500 border-green-500/20" };
    if (diffDays === 1) return { label: "Tomorrow", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
    if (diffDays <= 3) return { label: "This Week", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
    return { label: `In ${diffDays} days`, color: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  };

  if (loading && contests.length === 0) return <FullPageLoader />;

  return (
    <div className="space-y-12">
      <div className="pb-6 border-b border-[#222225] space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-slate-500 hover:text-slate-200 transition-colors"
          title="Back to Dashboard"
        >
          ← Back to Dashboard
        </Link>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e23e2d]/10 border border-[#e23e2d]/20 text-[#e23e2d] font-mono text-[9px] font-semibold uppercase tracking-wider">
            <span>ecosystem schedule</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-[Cormorant_Garamond] font-light italic text-white tracking-tight leading-tight">
            Contest <br />
            <span className="text-[#e23e2d]">Arena.</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed">
            Track upcoming competitive programming battles and events scheduled across LeetCode, Codeforces, AtCoder, and CodeChef.
          </p>
        </div>
      </div>

      {/* Platform Filter Section */}
      <div className="bg-[#121214] border border-[#222225] p-6 rounded-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#0c0c0c] border border-[#222225] rounded-full flex items-center justify-center text-[#e23e2d] text-base">
            <FiFilter />
          </div>
          <div>
            <h2 className="text-sm font-[Cormorant_Garamond] font-semibold italic text-slate-200">Information filters</h2>
            <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Toggle platforms to monitor</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatforms.includes(platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded text-[9px] font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#e23e2d] text-white border-[#e23e2d] font-semibold"
                    : "bg-[#0c0c0c] text-slate-500 border-[#222225] hover:text-slate-300"
                }`}
              >
                {platform.id === "atcoder" ? (
                  <Icon isSelected={isSelected} />
                ) : (
                  <Icon className={isSelected ? "text-white" : platform.colorClass} />
                )}
                <span>{platform.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="bg-[#121214] border border-[#222225] p-12 text-center rounded-xl space-y-6 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 text-lg">
            <FiCalendar />
          </div>
          <h3 className="text-xl font-[Cormorant_Garamond] font-semibold italic text-white">Connection failed</h3>
          <p className="text-slate-400 text-xs font-mono max-w-xs mx-auto leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchContests}
            className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <FiRefreshCw />
            Retry Connection
          </button>
        </div>
      ) : contests.length === 0 ? (
        <div className="bg-[#121214] border border-[#222225] p-12 text-center rounded-xl space-y-6 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#e23e2d]/10 border border-[#e23e2d]/20 rounded-full flex items-center justify-center mx-auto text-[#e23e2d] text-lg">
            <FiCalendar />
          </div>
          <h3 className="text-xl font-[Cormorant_Garamond] font-semibold italic text-white">Arena empty</h3>
          <p className="text-slate-400 text-xs font-mono max-w-xs mx-auto leading-relaxed">
            No upcoming competitions detected in the selected information sources. Try expanding your filter range.
          </p>
          <button
            onClick={() => setSelectedPlatforms(["leetcode", "codeforces", "codechef", "atcoder"])}
            className="px-5 py-2.5 bg-[#0c0c0c] border border-[#222225] hover:bg-[#121214] text-slate-300 font-mono text-[9px] font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#121214] border border-[#222225] p-4 rounded-xl text-center space-y-1">
              <div className="text-2xl font-mono font-bold text-white">{contests.length}</div>
              <div className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-500">Total Events</div>
            </div>
            <div className="bg-[#121214] border border-[#222225] p-4 rounded-xl text-center space-y-1">
              <div className="text-2xl font-mono font-bold text-orange-500">
                {contests.filter(c => c.platform === "leetcode").length}
              </div>
              <div className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-500">LeetCode</div>
            </div>
            <div className="bg-[#121214] border border-[#222225] p-4 rounded-xl text-center space-y-1">
              <div className="text-2xl font-mono font-bold text-blue-500">
                {contests.filter(c => c.platform === "codeforces").length}
              </div>
              <div className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-500">Codeforces</div>
            </div>
            <div className="bg-[#121214] border border-[#222225] p-4 rounded-xl text-center space-y-1">
              <div className="text-2xl font-mono font-bold text-slate-400">
                {contests.filter(c => ["codechef", "atcoder"].includes(c.platform)).length}
              </div>
              <div className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-500">Others</div>
            </div>
          </div>

          {/* Grouped Contests */}
          {Object.entries(groupedContests).map(([date, dateContests]) => {
            const badge = getDateBadge(date);
            return (
              <div key={date} className="space-y-6">
                {/* Date header */}
                <div className="flex items-center justify-between gap-4 mb-4 border-b border-[#222225] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#121214] border border-[#222225] rounded-full flex items-center justify-center text-slate-400 text-sm">
                      <FiCalendar />
                    </div>
                    <div>
                      <h2 className="text-base font-[Cormorant_Garamond] font-semibold italic text-slate-100 leading-none">{formatDateHeader(date)}</h2>
                      <p className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mt-1">
                        {dateContests.length} Event{dateContests.length > 1 ? "s" : ""} Scheduled
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider border bg-[#0c0c0c] ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Contest grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dateContests.map((contest) => (
                    <ContestCard key={contest._id} contest={contest} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
