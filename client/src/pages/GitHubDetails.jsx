import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import api from "../api/axios";

export default function GitHubDetails() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/stats/all")
      .then((res) => {
        const github = res.data.stats.find(s => s.platform === "github");
        setData(github);
      })
      .catch(() => setData(null));
  }, []);

  if (!data) return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-8">
        <Loader />
      </main>
    </div>
  );

  const stats = data.stats || {};
  const hasStats = Object.keys(stats).length > 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-8">
        <div className="app-container">
          <button 
            onClick={() => navigate("/")} 
            className="mb-6 text-blue-400 hover:text-blue-300 flex items-center gap-2 fade-in-scale"
          >
            ← Back to Dashboard
          </button>

          <div className="mb-8 fade-in-scale">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-xl github-gradient flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                GH
              </div>
              <div>
                <h1 className="text-5xl font-black neon-text">GitHub Profile</h1>
                <p className="text-gray-400 text-lg">@{data.username}</p>
              </div>
            </div>
          </div>

          {!hasStats ? (
            <div className="glass-card p-12 rounded-2xl text-center">
              <div className="text-6xl mb-4 opacity-30">🔄</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-300">Stats Loading</h3>
              <p className="text-gray-500">GitHub stats are being fetched. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              {stats.name && (
                <div className="glass-card-hover p-6 rounded-2xl mb-6 fade-in-up">
                  <div className="flex items-center gap-6">
                    {stats.avatar && (
                      <img 
                        src={stats.avatar} 
                        alt={stats.name}
                        className="w-24 h-24 rounded-full border-4 border-purple-500/30"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">{stats.name}</h2>
                      {stats.bio && <p className="text-gray-400 mb-2">{stats.bio}</p>}
                      {stats.company && <p className="text-sm text-gray-500">🏢 {stats.company}</p>}
                      {stats.location && <p className="text-sm text-gray-500">📍 {stats.location}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Main Stats */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 neon-text">Profile Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-card-hover p-6 rounded-xl fade-in-up">
                    <div className="stat-label mb-2">Followers</div>
                    <div className="stat-value-lg">{stats.followers?.toLocaleString() || 0}</div>
                  </div>
                  <div className="glass-card-hover p-6 rounded-xl fade-in-up delay-100">
                    <div className="stat-label mb-2">Following</div>
                    <div className="text-3xl font-bold text-purple-400">{stats.following?.toLocaleString() || 0}</div>
                  </div>
                  <div className="glass-card-hover p-6 rounded-xl fade-in-up delay-200">
                    <div className="stat-label mb-2">Public Repos</div>
                    <div className="text-3xl font-bold text-cyan-400">{stats.publicRepos?.toLocaleString() || 0}</div>
                  </div>
                  <div className="glass-card-hover p-6 rounded-xl fade-in-up delay-300">
                    <div className="stat-label mb-2">Public Gists</div>
                    <div className="text-3xl font-bold text-green-400">{stats.publicGists?.toLocaleString() || 0}</div>
                  </div>
                </div>
              </div>

              {/* Repository Stats */}
              {stats.totalStars !== undefined && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 neon-text">Repository Stats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard label="Total Stars" value={stats.totalStars?.toLocaleString()} icon="⭐" />
                    <StatCard label="Total Forks" value={stats.totalForks?.toLocaleString()} icon="🔱" />
                    <StatCard label="Total Watchers" value={stats.totalWatchers?.toLocaleString()} icon="👁️" />
                  </div>
                </div>
              )}

              {/* Top Repositories */}
              {stats.topRepositories && stats.topRepositories.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 neon-text">Top Repositories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.topRepositories.slice(0, 6).map((repo, idx) => (
                      <a
                        key={repo.url}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`glass-card-hover p-5 rounded-xl fade-in-up delay-${idx * 100} hover:scale-105 transition-transform`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-blue-400 hover:text-blue-300">{repo.name}</h3>
                          <span className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300">{repo.language}</span>
                        </div>
                        {repo.description && (
                          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{repo.description}</p>
                        )}
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">⭐ {repo.stars?.toLocaleString()}</span>
                          <span className="flex items-center gap-1">🔱 {repo.forks?.toLocaleString()}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Used */}
              {stats.languagesUsed && Object.keys(stats.languagesUsed).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 neon-text">Languages Used</h2>
                  <div className="glass-card-hover p-6 rounded-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {Object.entries(stats.languagesUsed)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 12)
                        .map(([lang, count]) => (
                          <div key={lang} className="text-center p-3 rounded-lg bg-slate-800/50">
                            <div className="text-2xl font-bold text-cyan-400">{count}</div>
                            <div className="text-xs text-gray-400 mt-1">{lang}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {stats.recentActivity && stats.recentActivity.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 neon-text">Recent Activity</h2>
                  <div className="glass-card-hover p-6 rounded-2xl">
                    <div className="space-y-3">
                      {stats.recentActivity.slice(0, 10).map((activity, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{
                              activity.type === 'PushEvent' ? '📤' :
                              activity.type === 'PullRequestEvent' ? '🔀' :
                              activity.type === 'IssuesEvent' ? '📋' :
                              activity.type === 'IssueCommentEvent' ? '💬' :
                              activity.type === 'CreateEvent' ? '✨' :
                              activity.type === 'DeleteEvent' ? '🗑️' :
                              activity.type === 'ForkEvent' ? '🍴' :
                              '📊'
                            }</span>
                            <div>
                              <div className="text-sm font-semibold text-white">{activity.type.replace('Event', '')}</div>
                              <div className="text-xs text-gray-400">{activity.repo}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Event Types Distribution */}
              {stats.eventTypes && Object.keys(stats.eventTypes).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 neon-text">Activity Breakdown</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(stats.eventTypes)
                      .sort((a, b) => b[1] - a[1])
                      .map(([event, count]) => (
                        <StatCard 
                          key={event} 
                          label={event.replace('Event', '')} 
                          value={count} 
                          icon="📊" 
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Account Info */}
              {stats.createdAt && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 neon-text">Account Information</h2>
                  <div className="glass-card-hover p-6 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-gray-400 text-sm mb-1">Account Created</div>
                        <div className="text-lg font-bold text-white">
                          {new Date(stats.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1">Last Updated</div>
                        <div className="text-lg font-bold text-white">
                          {new Date(stats.updatedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1">Profile URL</div>
                        <a 
                          href={stats.profileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg font-bold text-blue-400 hover:text-blue-300"
                        >
                          View on GitHub →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
