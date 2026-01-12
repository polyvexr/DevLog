import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import api from "../api/axios";
import { FiStar, FiCalendar, FiBarChart2, FiActivity } from "react-icons/fi";
import { RiFireLine } from "react-icons/ri";
import { SiLeetcode } from "react-icons/si";

export default function LeetCodeDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/stats/all")
      .then((res) => {
        const leetcode = res.data.stats.find((s) => s.platform === "leetcode");
        if (leetcode) {
          setData(leetcode);
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
        <h2 className="text-2xl font-bold text-white mb-4">LeetCode Not Linked</h2>
        <p className="text-gray-400 mb-8">Please link your LeetCode account first.</p>
        <button
          onClick={() => navigate("/link")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
        >
          Link LeetCode
        </button>
      </div>
    );
  }

  const stats = data.stats || {};
  const submissionsByDifficulty = stats.submissionsByDifficulty || {};
  const easy = submissionsByDifficulty.easy || { solved: 0, submissions: 0 };
  const medium = submissionsByDifficulty.medium || { solved: 0, submissions: 0 };
  const hard = submissionsByDifficulty.hard || { solved: 0, submissions: 0 };
  const all = submissionsByDifficulty.all || { solved: 0, total: 1 }; // Default total to 1 to avoid division by zero

  // Calculate efficiency safely
  const efficiency = all.total > 0 ? ((all.solved / all.total) * 100).toFixed(1) : "0.0";

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
          <div className="w-24 h-24 rounded-3xl leetcode-gradient flex items-center justify-center text-4xl shadow-2xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
            <SiLeetcode className="text-white" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2">
              LeetCode <span className="animate-text-shine">Intelligence</span>
            </h1>
            <p className="text-blue-400 text-xl font-black tracking-widest uppercase">
              @{data.username}
            </p>
          </div>
        </div>
      </div>

      {/* Global Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-card-premium p-8 lg:col-span-2">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Rank Intelligence</div>
          <div className="flex items-end gap-1">
            <span className="text-6xl font-black text-white italic">#{stats.ranking?.toLocaleString() || "—"}</span>
            <span className="text-blue-500 font-black text-lg mb-2">Global</span>
          </div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Reputation</div>
          <div className="text-4xl font-black text-purple-400">{stats.reputation?.toLocaleString() || 0}</div>
        </div>
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Identity</div>
          <div className="text-2xl font-black text-white truncate">{stats.realName || "Anonymous"}</div>
        </div>
      </div>

      {/* Submissions by Difficulty */}
      <div className="mb-16">
        <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          Problem Solving Matrix
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card-premium p-8 border-none ring-1 ring-white/10 group">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6 group-hover:text-blue-400 transition-colors">Efficiency</div>
            <div className="text-5xl font-black text-white mb-2 italic">
               {efficiency}%
            </div>
            <div className="text-xs font-bold text-gray-500">{all.solved} / {all.total} Solved</div>
          </div>
          
          <div className="glass-card-premium p-8 ring-1 ring-green-500/20">
            <div className="text-xs font-black uppercase tracking-widest text-green-500/50 mb-6">Fundamental</div>
            <div className="text-5xl font-black text-green-400 mb-2 italic">{easy.solved}</div>
            <div className="text-xs font-bold text-gray-500">{easy.submissions} Submissions</div>
          </div>

          <div className="glass-card-premium p-8 ring-1 ring-yellow-500/20">
            <div className="text-xs font-black uppercase tracking-widest text-yellow-500/50 mb-6">Intermediate</div>
            <div className="text-5xl font-black text-yellow-400 mb-2 italic">{medium.solved}</div>
            <div className="text-xs font-bold text-gray-500">{medium.submissions} Submissions</div>
          </div>

          <div className="glass-card-premium p-8 ring-1 ring-red-500/20">
            <div className="text-xs font-black uppercase tracking-widest text-red-500/50 mb-6">Advanced</div>
            <div className="text-5xl font-black text-red-400 mb-2 italic">{hard.solved}</div>
            <div className="text-xs font-bold text-gray-500">{hard.submissions} Submissions</div>
          </div>
        </div>
      </div>

      {/* Contest Stats */}
      {stats.contestRanking && (
        <div className="mb-16">
          <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            Competitive Trajectory
          </h2>
          <div className="glass-card-premium p-10 bg-gradient-to-br from-white/[0.03] to-purple-500/[0.03]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <div className="space-y-2">
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Rating</div>
                <div className="text-5xl font-black text-purple-400 italic">
                  {stats.contestRanking.rating}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Percentile</div>
                <div className="text-5xl font-black text-cyan-400 italic">
                  {stats.contestRanking.topPercentage}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Global Rank</div>
                <div className="text-4xl font-black text-white italic">
                  #{stats.contestRanking.globalRanking?.toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Recognition</div>
                <div className="text-3xl font-black text-yellow-500 uppercase italic">
                  {stats.contestRanking.badge || "Unranked"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topics & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Skill Distribution</h2>
          <div className="glass-card-premium p-8 space-y-8">
            {stats.tagStats?.advanced && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">Advanced Mastery</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.tagStats.advanced.slice(0, 8).map(tag => (
                    <div key={tag.tagSlug} className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs font-bold text-white hover:bg-purple-500/20 transition-all cursor-default">
                      {tag.tagName} <span className="text-purple-400 ml-1">{tag.problemsSolved}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {stats.tagStats?.intermediate && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">Functional Mastery</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.tagStats.intermediate.slice(0, 8).map(tag => (
                    <div key={tag.tagSlug} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs font-bold text-white hover:bg-blue-500/20 transition-all cursor-default">
                      {tag.tagName} <span className="text-blue-400 ml-1">{tag.problemsSolved}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Recent Activity</h2>
          <div className="glass-card-premium p-4">
            <div className="space-y-1">
              {stats.recentSubmissions?.slice(0, 8).map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 opacity-50 group-hover:scale-150 transition-transform"></div>
                    <div className="font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-[200px]">{sub.title}</div>
                  </div>
                  <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    {new Date(parseInt(sub.timestamp) * 1000).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      {stats.badges && (
        <div className="mb-16">
          <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest">Achievement Unlock History</h2>
          <div className="glass-card-premium p-10">
            <div className="flex flex-wrap gap-10 justify-center">
              {stats.badges.slice(0, 12).map((badge) => (
                <div key={badge.id} className="group relative flex flex-col items-center">
                  <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src={badge.icon} alt={badge.displayName} className="w-24 h-24 mb-6 relative group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] text-center max-w-[100px] leading-relaxed">
                    {badge.displayName}
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
