import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/stats/all")
      .then((res) => setStats(res.data.stats))
      .catch(() => setStats([]));
  }, []);

  const renderLeetCodeStats = (item) => {
    const submissions = item.stats?.acSubmissionNum || [];
    const all = submissions.find(s => s.difficulty === "All")?.count || 0;
    const easy = submissions.find(s => s.difficulty === "Easy")?.count || 0;
    const medium = submissions.find(s => s.difficulty === "Medium")?.count || 0;
    const hard = submissions.find(s => s.difficulty === "Hard")?.count || 0;

    return (
      <div key={item._id} className="glass-card-hover p-6 rounded-2xl fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl leetcode-gradient flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              LC
            </div>
            <div>
              <h2 className="text-2xl font-bold neon-text capitalize">{item.platform}</h2>
              <div className="text-sm text-gray-400">@{item.username}</div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
            ● Active
          </div>
        </div>

        <div className="mb-4">
          <div className="stat-value-lg mb-2">{all.toLocaleString()}</div>
          <div className="stat-label">Total Problems Solved</div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <StatCard label="Easy" value={easy} icon="✓" gradient="from-green-400 to-emerald-500" />
          <StatCard label="Medium" value={medium} icon="◆" gradient="from-yellow-400 to-orange-500" />
          <StatCard label="Hard" value={hard} icon="★" gradient="from-red-400 to-pink-500" />
        </div>
      </div>
    );
  };

  const renderCodeforcesStats = (item) => {
    const { rating = 0, maxRating = 0, rank = "N/A", friendOfCount = 0 } = item.stats || {};

    return (
      <div key={item._id} className="glass-card-hover p-6 rounded-2xl fade-in-up delay-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl codeforces-gradient flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              CF
            </div>
            <div>
              <h2 className="text-2xl font-bold neon-text capitalize">{item.platform}</h2>
              <div className="text-sm text-gray-400">@{item.username}</div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
            ● Active
          </div>
        </div>

        <div className="mb-4">
          <div className="stat-value-lg mb-2">{rating.toLocaleString()}</div>
          <div className="stat-label">Current Rating</div>
          <div className="mt-2 text-purple-400 text-sm font-semibold capitalize">{rank}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <StatCard label="Max Rating" value={maxRating} icon="🏆" />
          <StatCard label="Followers" value={friendOfCount} icon="👥" />
        </div>
      </div>
    );
  };

  const renderGitHubStats = (item) => {
    const { followers = 0, following = 0, publicRepos = 0, publicGists = 0 } = item.stats || {};

    return (
      <div key={item._id} className="glass-card-hover p-6 rounded-2xl fade-in-up delay-400">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl github-gradient flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              GH
            </div>
            <div>
              <h2 className="text-2xl font-bold neon-text capitalize">{item.platform}</h2>
              <div className="text-sm text-gray-400">@{item.username}</div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold border border-purple-500/30">
            ● Active
          </div>
        </div>

        <div className="mb-4">
          <div className="stat-value-lg mb-2">{followers.toLocaleString()}</div>
          <div className="stat-label">Followers</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <StatCard label="Repos" value={publicRepos} icon="📦" />
          <StatCard label="Gists" value={publicGists} icon="📝" />
          <StatCard label="Following" value={following} icon="👤" />
          <StatCard label="Visibility" value="Public" icon="🌐" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-8">
        <div className="app-container">
          <div className="mb-8 fade-in-scale">
            <h1 className="text-5xl font-black mb-3 neon-text">Dashboard</h1>
            <p className="text-gray-400 text-lg">Track your coding journey across platforms</p>
          </div>

          {!stats ? (
            <Loader />
          ) : stats.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl text-center">
              <div className="text-6xl mb-4 opacity-30">📊</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-300">No Stats Yet</h3>
              <p className="text-gray-500">Link your coding platforms to start tracking</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {stats.map((item) => {
                if (item.platform === "leetcode") return renderLeetCodeStats(item);
                if (item.platform === "codeforces") return renderCodeforcesStats(item);
                if (item.platform === "github") return renderGitHubStats(item);
                return null;
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
