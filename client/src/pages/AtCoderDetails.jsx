import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import api from "../api/axios";

export default function AtCoderDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/stats/all")
      .then((res) => {
        const stats = res.data.data?.stats || res.data.stats || [];
        const atcoder = stats.find((s) => s.platform === "atcoder");
        if (atcoder) {
          setData(atcoder);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  
  if (error || !data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">AtCoder Not Linked</h2>
        <p className="text-gray-400 mb-8">Please link your AtCoder account first.</p>
        <button
          onClick={() => navigate("/link")}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all"
        >
          Link AtCoder
        </button>
      </div>
    );
  }

  const stats = data.stats || {};
  const solvedByDifficulty = stats.solvedByDifficulty || {};
  const ratingHistory = stats.ratingHistory || [];

  // AtCoder rank colors
  const rankColors = {
    gray: "#808080",
    brown: "#804000",
    green: "#008000",
    cyan: "#00C0C0",
    blue: "#0000FF",
    yellow: "#C0C000",
    orange: "#FF8000",
    red: "#FF0000",
  };

  const rankColor = rankColors[stats.rankColor] || rankColors.gray;

  return (
    <>
      <button
        onClick={() => navigate("/")}
        className="mb-10 text-gray-400 hover:text-white flex items-center gap-2 group transition-all fade-in-scale"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span className="font-bold uppercase tracking-widest text-xs">Return to Command Center</span>
      </button>

      <div className="mb-12 fade-in-scale">
        <div className="flex items-center gap-8">
          <div 
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-2xl font-black shadow-2xl group-hover:scale-110 transition-transform text-white"
            style={{ backgroundColor: "#222222", boxShadow: "0 20px 40px rgba(34, 34, 34, 0.5)" }}
          >
            AT
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2">
              AtCoder <span className="animate-text-shine">Intelligence</span>
            </h1>
            <p className="text-cyan-400 text-xl font-black tracking-widest uppercase">
              @{data.username}
            </p>
          </div>
        </div>
      </div>

      {/* Rating & Rank */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-card-premium p-8 lg:col-span-2">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Current Rating</div>
          <div className="flex items-end gap-3">
            <span 
              className="text-6xl font-black italic"
              style={{ color: rankColor }}
            >
              {stats.rating || 0}
            </span>
            <span className="text-gray-500 font-black text-lg mb-2">/ {stats.highestRating || 0} Peak</span>
          </div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Rank Color</div>
          <div 
            className="text-3xl font-black uppercase"
            style={{ color: rankColor }}
          >
            {stats.rankColor || "Unrated"}
          </div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">AC Rank</div>
          <div className="text-4xl font-black text-white">#{stats.acRank?.toLocaleString() || "—"}</div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Contests</div>
          <div className="text-5xl font-black text-white italic">{stats.contestsParticipated || 0}</div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Avg Performance</div>
          <div className="text-5xl font-black text-cyan-400 italic">{stats.averagePerformance || 0}</div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Best Performance</div>
          <div className="text-5xl font-black text-green-400 italic">{stats.bestPerformance || 0}</div>
        </div>
      </div>

      {/* Problems by Difficulty Color */}
      <div className="mb-16">
        <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          Problems by Difficulty
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-card-premium p-8">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Total Solved</div>
            <div className="text-5xl font-black text-white mb-2 italic">{stats.totalSolved || stats.acCount || 0}</div>
          </div>
          {Object.entries(solvedByDifficulty).map(([color, count]) => (
            <div 
              key={color} 
              className="glass-card-premium p-6"
              style={{ borderColor: `${rankColors[color]}30` }}
            >
              <div 
                className="text-xs font-black uppercase tracking-widest mb-4"
                style={{ color: rankColors[color] }}
              >
                {color}
              </div>
              <div 
                className="text-4xl font-black italic"
                style={{ color: rankColors[color] }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contest History */}
      {ratingHistory.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            Contest History
          </h2>
          <div className="glass-card-premium p-6">
            <div className="space-y-2">
              {ratingHistory.slice(0, 10).map((contest, idx) => {
                const ratingChange = contest.newRating - contest.oldRating;
                const changeColor = ratingChange >= 0 ? "#22C55E" : "#EF4444";
                return (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-xs font-black text-cyan-400">
                        #{contest.place}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-400 transition-colors truncate max-w-[300px]">
                          {contest.contestName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Perf: <span className="text-purple-400">{contest.performance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{contest.newRating}</div>
                      <div 
                        className="text-sm font-bold"
                        style={{ color: changeColor }}
                      >
                        {ratingChange >= 0 ? "+" : ""}{ratingChange}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
