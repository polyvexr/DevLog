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

              {/* Account Info */}
              {stats.createdAt && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 neon-text">Account Information</h2>
                  <div className="glass-card-hover p-6 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-gray-400 text-sm mb-1">Account Created</div>
                        <div className="text-xl font-bold text-white">
                          {new Date(stats.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1">Username</div>
                        <div className="text-xl font-bold text-blue-400">@{data.username}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Stats */}
              {(stats.stars || stats.forks || stats.watchers) && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 neon-text">Repository Stats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.stars !== undefined && <StatCard label="Total Stars" value={stats.stars} icon="⭐" />}
                    {stats.forks !== undefined && <StatCard label="Total Forks" value={stats.forks} icon="🔱" />}
                    {stats.watchers !== undefined && <StatCard label="Total Watchers" value={stats.watchers} icon="👁️" />}
                  </div>
                </div>
              )}

              {/* Contribution Stats */}
              {(stats.totalCommits || stats.totalPRs || stats.totalIssues) && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 neon-text">Contributions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.totalCommits !== undefined && <StatCard label="Total Commits" value={stats.totalCommits} icon="💻" />}
                    {stats.totalPRs !== undefined && <StatCard label="Pull Requests" value={stats.totalPRs} icon="🔀" />}
                    {stats.totalIssues !== undefined && <StatCard label="Issues Created" value={stats.totalIssues} icon="📋" />}
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
