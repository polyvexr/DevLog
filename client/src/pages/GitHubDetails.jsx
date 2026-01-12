import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import api from "../api/axios";
import {
  FiStar,
  FiGitBranch,
  FiRefreshCw,
  FiUpload,
  FiGitPullRequest,
  FiBriefcase,
  FiMapPin,
} from "react-icons/fi";
import { SiGithub } from "react-icons/si";

export default function GitHubDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/stats/all")
      .then((res) => {
        const github = res.data.stats.find((s) => s.platform === "github");
        if (github) {
          setData(github);
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
        <h2 className="text-2xl font-bold text-white mb-4">GitHub Not Linked</h2>
        <p className="text-gray-400 mb-8">Please link your GitHub account first.</p>
        <button
          onClick={() => navigate("/link")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
        >
          Link GitHub
        </button>
      </div>
    );
  }

  const stats = data.stats || {};
  const hasStats = Object.keys(stats).length > 0;

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
          <div className="w-24 h-24 rounded-3xl github-gradient flex items-center justify-center text-4xl shadow-2xl shadow-purple-500/20 group-hover:scale-110 transition-transform">
            <SiGithub className="text-white" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2 italic">
              GitHub <span className="animate-text-shine">Pulse</span>
            </h1>
            <p className="text-blue-400 text-xl font-black tracking-widest uppercase">
              @{data.username}
            </p>
          </div>
        </div>
      </div>

      {!hasStats ? (
        <div className="glass-card-premium p-20 text-center">
          <FiRefreshCw className="text-6xl mb-6 text-blue-500 opacity-50 animate-spin mx-auto" />
          <h3 className="text-3xl font-black mb-2 text-white">Aggregating Data</h3>
          <p className="text-gray-500 text-lg">Retrieving repository intelligence from GitHub nodes...</p>
        </div>
      ) : (
        <>
          {/* Enhanced Profile Summary */}
          <div className="glass-card-premium p-10 mb-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl -mr-32 -mt-32"></div>
            <div className="flex flex-col md:flex-row items-center gap-10">
              {stats.avatar && (
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img
                    src={stats.avatar}
                    alt={stats.name}
                    className="w-32 h-32 rounded-3xl border-2 border-white/10 relative z-10 shadow-2xl"
                  />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-black text-white mb-2">{stats.name || data.username}</h2>
                <p className="text-gray-400 text-lg mb-6 max-w-2xl">{stats.bio || "No biography available. Developer is a ghost in the shell."}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  {stats.company && (
                    <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-[10px] bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/10">
                      <FiBriefcase /> {stats.company}
                    </div>
                  )}
                  {stats.location && (
                    <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-[10px] bg-purple-500/5 px-4 py-2 rounded-full border border-purple-500/10">
                      <FiMapPin /> {stats.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="glass-card-premium p-8 group hover:-translate-y-1 transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 group-hover:text-blue-400">Collaborators</div>
              <div className="text-5xl font-black text-white italic">{stats.followers || 0}</div>
            </div>
            <div className="glass-card-premium p-8 group hover:-translate-y-1 transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 group-hover:text-purple-400">Following</div>
              <div className="text-5xl font-black text-white italic">{stats.following || 0}</div>
            </div>
            <div className="glass-card-premium p-8 group hover:-translate-y-1 transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 group-hover:text-cyan-400">Total Stars</div>
              <div className="text-5xl font-black text-white italic">{stats.totalStars || 0}</div>
            </div>
            <div className="glass-card-premium p-8 group hover:-translate-y-1 transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 group-hover:text-green-400">Public Nodes</div>
              <div className="text-5xl font-black text-white italic">{stats.publicRepos || 0}</div>
            </div>
          </div>

          {/* Top Repositories Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-widest flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Repository Intelligence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.topRepositories?.slice(0, 6).map((repo) => (
                <a
                  key={repo.url}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card-premium p-8 group hover:-translate-y-2 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all">
                     <FiGitBranch size={48} />
                  </div>
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors truncate">
                      {repo.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">
                      {repo.description || "The owner of this repository has not provided a description."}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1.5 text-xs font-black text-gray-400 group-hover:text-yellow-500 transition-colors">
                          <FiStar size={14} /> {repo.stars}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-black text-gray-400 group-hover:text-blue-400 transition-colors">
                          <FiGitBranch size={14} /> {repo.forks}
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/50">
                        {repo.language || "Unknown"}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
               <h2 className="text-2xl font-black text-white uppercase tracking-widest">Network Activity</h2>
               <div className="glass-card-premium p-4 md:p-6">
                  <div className="space-y-2">
                    {stats.recentActivity?.slice(0, 8).map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 transition-colors group-hover:text-white group-hover:rotate-3">
                             {activity.type === "PushEvent" ? <FiUpload /> : <FiGitPullRequest />}
                          </div>
                          <div>
                            <div className="text-xs font-black text-white mb-1">{activity.type.replace('Event', '')}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 truncate max-w-[150px]">{activity.repo}</div>
                          </div>
                        </div>
                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <h2 className="text-2xl font-black text-white uppercase tracking-widest">Language Breakdown</h2>
               <div className="glass-card-premium p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
                    {Object.entries(stats.languagesUsed || {}).sort((a,b) => b[1]-a[1]).slice(0, 9).map(([lang, count]) => (
                      <div key={lang} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-blue-500/30 transition-all">
                        <div className="text-2xl font-black text-white mb-1">{count}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-500/50 group-hover:text-blue-400 transition-colors">{lang}</div>
                      </div>
                    ))}
                  </div>
               </div>
               
               {/* Account Timeline Info */}
               <div className="glass-card-premium p-8 bg-gradient-to-br from-white/[0.02] to-blue-500/[0.05]">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Protocol Init</div>
                      <div className="text-lg font-black text-white">{new Date(stats.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Last Sync</div>
                      <div className="text-lg font-black text-blue-400">{new Date(stats.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
