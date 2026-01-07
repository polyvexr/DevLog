import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import api from "../api/axios";

export default function CodeforcesDetails() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/stats/all")
      .then((res) => {
        const cf = res.data.stats.find((s) => s.platform === "codeforces");
        setData(cf);
      })
      .catch(() => setData(null));
  }, []);

  if (!data) return <Loader />;

  const stats = data.stats;

  return (
    <>
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-blue-400 hover:text-blue-300 flex items-center gap-2 fade-in-scale"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-8 fade-in-scale">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-xl codeforces-gradient flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            CF
          </div>
          <div>
            <h1 className="text-5xl font-black neon-text">
              Codeforces Profile
            </h1>
            <p className="text-gray-400 text-lg">@{data.username}</p>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="glass-card-hover p-6 rounded-2xl mb-6 fade-in-up">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-gray-400 text-sm mb-1">Organization</div>
            <div className="text-lg font-bold text-white">
              {stats.organization || "N/A"}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Country</div>
            <div className="text-lg font-bold text-white">
              {stats.country || "N/A"}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">City</div>
            <div className="text-lg font-bold text-white">
              {stats.city || "N/A"}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Contribution</div>
            <div className="text-lg font-bold text-green-400">
              +{stats.contribution || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 neon-text">Rating & Rank</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card-hover p-6 rounded-xl fade-in-up">
            <div className="stat-label mb-2">Current Rating</div>
            <div className="stat-value-lg">
              {stats.rating?.toLocaleString()}
            </div>
          </div>
          <div className="glass-card-hover p-6 rounded-xl fade-in-up delay-100">
            <div className="stat-label mb-2">Max Rating</div>
            <div className="text-3xl font-bold text-purple-400">
              {stats.maxRating?.toLocaleString()}
            </div>
          </div>
          <div className="glass-card-hover p-6 rounded-xl fade-in-up delay-200">
            <div className="stat-label mb-2">Current Rank</div>
            <div className="text-2xl font-bold text-yellow-400 capitalize">
              {stats.rank}
            </div>
          </div>
          <div className="glass-card-hover p-6 rounded-xl fade-in-up delay-300">
            <div className="stat-label mb-2">Followers</div>
            <div className="text-3xl font-bold text-cyan-400">
              {stats.friendOfCount?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 neon-text">
          Submission Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Submissions"
            value={stats.totalSubmissions?.toLocaleString()}
            icon="📤"
          />
          <StatCard
            label="Accepted"
            value={stats.acceptedSubmissions?.toLocaleString()}
            icon="✅"
          />
          <StatCard
            label="Problems Solved"
            value={stats.problemsSolved?.toLocaleString()}
            icon="🎯"
          />
          <StatCard
            label="Total Contests"
            value={stats.totalContests}
            icon="🏆"
          />
        </div>
      </div>

      {/* Contest Performance */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 neon-text">
          Contest Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Best Contest Rank"
            value={`#${stats.bestContestRank}`}
            icon="🥇"
          />
          <StatCard
            label="Worst Contest Rank"
            value={`#${stats.worstContestRank}`}
            icon="📊"
          />
          <StatCard
            label="Average Rank"
            value={`#${stats.averageRank}`}
            icon="📈"
          />
        </div>
      </div>

      {/* Problems by Rating */}
      {stats.problemsByRating && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 neon-text">
            Problems by Rating
          </h2>
          <div className="glass-card p-6 rounded-2xl">
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3">
              {Object.entries(stats.problemsByRating)
                .sort((a, b) => {
                  if (a[0] === "Unrated") return 1;
                  if (b[0] === "Unrated") return -1;
                  return parseInt(a[0]) - parseInt(b[0]);
                })
                .map(([rating, count]) => (
                  <div
                    key={rating}
                    className="bg-slate-900/30 p-3 rounded-lg text-center"
                  >
                    <div className="text-sm text-gray-400">{rating}</div>
                    <div className="text-xl font-bold text-blue-400">
                      {count}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Languages Used */}
      {stats.languagesUsed && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 neon-text">
            Programming Languages
          </h2>
          <div className="glass-card p-6 rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(stats.languagesUsed)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 18)
                .map(([lang, count]) => (
                  <div
                    key={lang}
                    className="bg-slate-900/30 p-4 rounded-lg text-center hover:bg-slate-800/40 transition-all"
                  >
                    <div className="text-sm text-gray-400 mb-1">{lang}</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {count}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Verdict Distribution */}
      {stats.verdictDistribution && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 neon-text">
            Verdict Distribution
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.verdictDistribution).map(
              ([verdict, count]) => {
                const color =
                  verdict === "OK"
                    ? "text-green-400"
                    : verdict === "WRONG_ANSWER"
                    ? "text-red-400"
                    : verdict === "TIME_LIMIT_EXCEEDED"
                    ? "text-yellow-400"
                    : "text-gray-400";
                return (
                  <div key={verdict} className="glass-card p-4 rounded-xl">
                    <div className="text-xs text-gray-400 mb-1">
                      {verdict.replace(/_/g, " ")}
                    </div>
                    <div className={`text-2xl font-bold ${color}`}>{count}</div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Rating Changes History */}
      {stats.ratingChanges && (
        <div>
          <h2 className="text-2xl font-bold mb-4 neon-text">
            Recent Rating Changes
          </h2>
          <div className="glass-card p-6 rounded-2xl">
            <div className="space-y-2">
              {stats.ratingChanges
                .slice(-15)
                .reverse()
                .map((change, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-gray-300 font-medium">
                        {change.contestName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Rank: #{change.rank}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyan-400">
                        {change.newRating}
                      </div>
                      <div
                        className={`text-sm font-semibold ${
                          change.ratingChange >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {change.ratingChange >= 0 ? "+" : ""}
                        {change.ratingChange}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
