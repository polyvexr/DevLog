import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import api from "../api/axios";
import { SiCodechef } from "react-icons/si";

export default function CodeChefDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/stats/all")
      .then((res) => {
        const stats = res.data.data?.stats || res.data.stats || [];
        const codechef = stats.find((s) => s.platform === "codechef");
        if (codechef) {
          setData(codechef);
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
        <h2 className="text-2xl font-bold text-white mb-4">CodeChef Not Linked</h2>
        <p className="text-gray-400 mb-8">Please link your CodeChef account first.</p>
        <button
          onClick={() => navigate("/link")}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all"
        >
          Link CodeChef
        </button>
      </div>
    );
  }

  const stats = data.stats || {};
  const problemsSolved = stats.problemsSolved || {};
  const ratingHistory = stats.ratingHistory || [];

  // Get star rating color
  const getStarColor = (stars) => {
    const colors = {
      1: "#666666",
      2: "#1E7D22",
      3: "#3366CC",
      4: "#684273",
      5: "#FFBF00",
      6: "#FF7F00",
      7: "#D0011B",
    };
    return colors[stars] || "#666666";
  };

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
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform"
            style={{ backgroundColor: "#5B4638", boxShadow: "0 20px 40px rgba(91, 70, 56, 0.3)" }}
          >
            <SiCodechef className="text-white" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2">
              CodeChef <span className="animate-text-shine">Analytics</span>
            </h1>
            <p className="text-amber-400 text-xl font-black tracking-widest uppercase">
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
            <span className="text-6xl font-black text-white italic">{stats.rating || 0}</span>
            <span className="text-amber-500 font-black text-lg mb-2">/ {stats.highestRating || 0} Peak</span>
          </div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Star Rating</div>
          <div className="flex items-center gap-2">
            <span 
              className="text-4xl font-black"
              style={{ color: getStarColor(stats.stars) }}
            >
              {"★".repeat(stats.stars || 1)}
            </span>
          </div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Division</div>
          <div className="text-4xl font-black text-white">{stats.division || "—"}</div>
        </div>
      </div>

      {/* Global & Country Rank */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Global Rank</div>
          <div className="text-5xl font-black text-white italic">
            #{stats.globalRank?.toLocaleString() || "—"}
          </div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Country Rank</div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-white italic">#{stats.countryRank?.toLocaleString() || "—"}</span>
            <span className="text-gray-500 font-bold text-lg mb-2">{stats.countryName || ""}</span>
          </div>
        </div>
      </div>

      {/* Problems by Difficulty */}
      <div className="mb-16">
        <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          Problem Solving Matrix
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="glass-card-premium p-8 ring-1 ring-white/10">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Total</div>
            <div className="text-5xl font-black text-white mb-2 italic">{stats.totalSolved || 0}</div>
          </div>
          <div className="glass-card-premium p-8 ring-1 ring-green-500/20">
            <div className="text-xs font-black uppercase tracking-widest text-green-500/50 mb-6">Easy</div>
            <div className="text-5xl font-black text-green-400 mb-2 italic">{problemsSolved.easy || 0}</div>
          </div>
          <div className="glass-card-premium p-8 ring-1 ring-yellow-500/20">
            <div className="text-xs font-black uppercase tracking-widest text-yellow-500/50 mb-6">Medium</div>
            <div className="text-5xl font-black text-yellow-400 mb-2 italic">{problemsSolved.medium || 0}</div>
          </div>
          <div className="glass-card-premium p-8 ring-1 ring-red-500/20">
            <div className="text-xs font-black uppercase tracking-widest text-red-500/50 mb-6">Hard</div>
            <div className="text-5xl font-black text-red-400 mb-2 italic">{problemsSolved.hard || 0}</div>
          </div>
          <div className="glass-card-premium p-8 ring-1 ring-purple-500/20">
            <div className="text-xs font-black uppercase tracking-widest text-purple-500/50 mb-6">Challenge</div>
            <div className="text-5xl font-black text-purple-400 mb-2 italic">{problemsSolved.challenge || 0}</div>
          </div>
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
              {ratingHistory.slice(0, 10).map((contest, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-xs font-black text-amber-400">
                      #{contest.rank}
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-amber-400 transition-colors">
                        {contest.contestName || contest.contestCode}
                      </div>
                      <div className="text-xs text-gray-500">{contest.date}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white">{contest.rating}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
