import { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaCode } from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import ContestCard from "../components/ContestCard";
import Loader from "../components/Loader";
import api from "../api/axios";

/**
 * Contests Page - Unified contest calendar with filters
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
    { id: "leetcode", name: "LeetCode", icon: SiLeetcode, color: "#ffa116" },
    { id: "codeforces", name: "Codeforces", icon: SiCodeforces, color: "#1f8acb" },
    { id: "codechef", name: "CodeChef", icon: SiCodechef, color: "#8b6914" },
    { id: "atcoder", name: "AtCoder", icon: FaCode, color: "#00a0e9" },
  ];

  useEffect(() => {
    fetchContests();
  }, [selectedPlatforms]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contests?platforms=${selectedPlatforms.join(",")}&days=30`);
      if (response.data.success) {
        setContests(response.data.contests);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load contests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FaCalendarAlt className="text-purple-400" size={24} />
              <h1 className="text-2xl font-bold text-white">Contest Calendar</h1>
            </div>
            <p className="text-gray-400">
              Upcoming contests from all major competitive programming platforms
            </p>
          </div>

          {/* Platform filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="flex items-center gap-2 text-gray-400 text-sm">
              <FaFilter size={14} />
              Filter:
            </span>
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    isSelected
                      ? "border-purple-500 bg-purple-500/20 text-white"
                      : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <Icon
                    size={16}
                    style={{ color: isSelected ? platform.color : "currentColor" }}
                  />
                  <span className="text-sm">{platform.name}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchContests}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : contests.length === 0 ? (
            <div className="text-center py-20">
              <FaCalendarAlt className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No upcoming contests found</p>
              <p className="text-gray-500 text-sm mt-1">
                Try selecting more platforms or check back later
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedContests).map(([date, dateContests]) => (
                <div key={date}>
                  {/* Date header */}
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-purple-500/50"></span>
                    {formatDateHeader(date)}
                    <span className="text-sm text-gray-500">({dateContests.length})</span>
                  </h2>

                  {/* Contest grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dateContests.map((contest) => (
                      <ContestCard key={contest._id} contest={contest} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
