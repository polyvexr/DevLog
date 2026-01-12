import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import api from "../api/axios";
import {
  FiSend,
  FiCheckCircle,
  FiTarget,
  FiAward,
  FiTrendingUp,
  FiBarChart2,
} from "react-icons/fi";
import { SiCodeforces } from "react-icons/si";

export default function CodeforcesDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/stats/all")
      .then((res) => {
        const cf = res.data.stats.find((s) => s.platform === "codeforces");
        if (cf) {
          setData(cf);
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
        <h2 className="text-2xl font-bold text-white mb-4">Codeforces Not Linked</h2>
        <p className="text-gray-400 mb-8">Please link your Codeforces account first.</p>
        <button
          onClick={() => navigate("/link")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
        >
          Link Codeforces
        </button>
      </div>
    );
  }

  const stats = data.stats || {};

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
          <div className="w-24 h-24 rounded-3xl codeforces-gradient flex items-center justify-center text-4xl shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <SiCodeforces className="text-white" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2 italic">
              Codeforces <span className="animate-text-shine">Engine</span>
            </h1>
            <p className="text-blue-400 text-xl font-black tracking-widest uppercase">
              @{data.username}
            </p>
          </div>
        </div>
      </div>

      {/* Competitive Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-card-premium p-8 lg:col-span-2">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Functional Rank</div>
          <div className="flex items-end gap-3">
             <span className="text-5xl font-black text-yellow-400 uppercase italic leading-none">{stats.rank || "Unrated"}</span>
          </div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Total Solving</div>
          <div className="text-5xl font-black text-white italic">{stats.problemsSolved || 0}</div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Contribution</div>
          <div className="text-4xl font-black text-green-400 italic">+{stats.contribution || 0}</div>
        </div>
      </div>

      {/* Rating & Performance Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          Performance Matrix
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card-premium p-8 ring-1 ring-blue-500/20 group">
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-500/50 mb-6">Current Rating</div>
            <div className="text-5xl font-black text-white mb-2 italic">{stats.rating || 0}</div>
            <div className="text-xs font-bold text-gray-500">Global Score</div>
          </div>
           <div className="glass-card-premium p-8 ring-1 ring-purple-500/20">
            <div className="text-[10px] font-black uppercase tracking-widest text-purple-500/50 mb-6">Peak Rating</div>
            <div className="text-5xl font-black text-purple-400 mb-2 italic">{stats.maxRating || 0}</div>
            <div className="text-xs font-bold text-gray-500">Lifetime High</div>
          </div>
          <div className="glass-card-premium p-8 border-none ring-1 ring-white/5">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Accepted</div>
            <div className="text-5xl font-black text-green-400 mb-2 italic">{stats.acceptedSubmissions || 0}</div>
            <div className="text-xs font-bold text-gray-500">Verified Solves</div>
          </div>
          <div className="glass-card-premium p-8 border-none ring-1 ring-white/5">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Simulations</div>
            <div className="text-5xl font-black text-cyan-400 mb-2 italic">{stats.totalContests || 0}</div>
            <div className="text-xs font-bold text-gray-500">Contests Logged</div>
          </div>
        </div>
      </div>

      {/* Rating Changes Timeline */}
      <div className="mb-16">
        <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          Evolutionary Timeline
        </h2>
        <div className="glass-card-premium p-4 md:p-8">
           <div className="space-y-4">
              {stats.ratingChanges?.slice(-8).reverse().map((change, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-all group overflow-hidden relative">
                   {/* Background bar for visual flair */}
                   <div className={`absolute left-0 top-0 bottom-0 w-1 ${change.ratingChange >= 0 ? 'bg-green-500' : 'bg-red-500'} opacity-50`}></div>

                   <div className="flex-1 min-w-0 pr-6">
                      <div className="text-lg font-black text-white group-hover:text-blue-400 transition-colors truncate mb-1">{change.contestName}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Contest Efficiency: Rank #{change.rank}</div>
                   </div>

                   <div className="text-right flex items-center gap-8">
                      <div className="hidden md:block">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Vector</div>
                        <div className={`text-xl font-black ${change.ratingChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {change.ratingChange >= 0 ? '+' : ''}{change.ratingChange}
                        </div>
                      </div>
                      <div className="w-px h-10 bg-white/5"></div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">New Rating</div>
                        <div className="text-3xl font-black text-white italic">{change.newRating}</div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Verdict & Language Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-8">
           <h2 className="text-2xl font-black text-white uppercase tracking-widest">Logic Verdict Distribution</h2>
           <div className="grid grid-cols-2 gap-4">
              {stats.verdictDistribution && Object.entries(stats.verdictDistribution).slice(0, 6).map(([verdict, count]) => (
                <div key={verdict} className="glass-card-premium p-6 border-none ring-1 ring-white/5 hover:ring-white/20 transition-all">
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">{verdict.replace(/_/g, ' ')}</div>
                   <div className={`text-3xl font-black ${verdict === 'OK' ? 'text-green-400' : 'text-gray-300'}`}>{count}</div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <h2 className="text-2xl font-black text-white uppercase tracking-widest">Syntax Preference</h2>
           <div className="glass-card-premium p-8">
              <div className="space-y-6">
                 {stats.languagesUsed && Object.entries(stats.languagesUsed).sort((a,b) => b[1]-a[1]).slice(0, 5).map(([lang, count]) => (
                    <div key={lang} className="space-y-2">
                       <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                          <span className="text-white">{lang}</span>
                          <span className="text-gray-500">{count} Solves</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"
                            style={{ width: `${(count / stats.totalSubmissions) * 100}%` }}
                          ></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </>
  );
}
