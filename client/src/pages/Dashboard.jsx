import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Dialog from "../components/Dialog";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    platform: null,
  });
  const [messageDialog, setMessageDialog] = useState({
    open: false,
    title: "",
    message: "",
  });

  const handleUnlink = (platform, e) => {
    if (e) e.stopPropagation();
    setConfirmDialog({ open: true, platform });
  };

  const doUnlink = async () => {
    const platform = confirmDialog.platform;
    setConfirmDialog({ open: false, platform: null });
    try {
      await api.delete(`/platforms/${platform}`);
      const res = await api.get("/stats/all");
      setStats(res.data.stats);
      setMessageDialog({
        open: true,
        title: "Unlinked",
        message: `${platform} has been unlinked.`,
      });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Error";
      const retry = err?.response?.data?.retryAfter;
      if (retry) {
        const when = new Date(retry).toLocaleString();
        setMessageDialog({
          open: true,
          title: "Action blocked",
          message: `${msg}\n\nTry again after ${when}.`,
        });
      } else {
        setMessageDialog({ open: true, title: "Error", message: msg });
      }
    }
  };

  useEffect(() => {
    api
      .get("/stats/all")
      .then((res) => setStats(res.data.stats))
      .catch(() => setStats([]));
  }, []);

  const renderLeetCodeStats = (item) => {
    const submissions = item.stats?.submissionsByDifficulty || {};
    const all = submissions.all?.solved || 0;
    const easy = submissions.easy?.solved || 0;
    const medium = submissions.medium?.solved || 0;
    const hard = submissions.hard?.solved || 0;
    const ranking = item.stats?.ranking || 0;
    const starRating = item.stats?.starRating || 0;

    return (
      <div
        key={item._id}
        onClick={() => navigate("/leetcode")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/leetcode");
          }
        }}
        aria-label={`Open ${item.platform} details`}
        className="glass-card-hover p-6 rounded-2xl fade-in-up cursor-pointer transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl leetcode-gradient flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              LC
            </div>
            <div>
              <h2 className="text-2xl font-bold neon-text capitalize">
                {item.platform}
              </h2>
              <div className="text-sm text-gray-400">@{item.username}</div>
            </div>
          </div>
          <div className="text-right relative">
            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30 mb-1">
              ● Active
            </div>
            <div className="text-yellow-400 text-sm">
              {"⭐".repeat(starRating)}
            </div>
            <button
              onClick={(e) => handleUnlink(item.platform, e)}
              className="absolute left-[-70px] top-[-10px] mt-2 mr-2 text-xs bg-red-600/20 text-red-400 px-3 py-2 rounded-full"
            >
              Unlink
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="stat-value-lg mb-2">{all.toLocaleString()}</div>
          <div className="stat-label">Total Problems Solved</div>
          <div className="text-sm text-gray-400 mt-1">
            Rank: #{ranking.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <StatCard
            label="Easy"
            value={easy}
            icon="✓"
            gradient="from-green-400 to-emerald-500"
          />
          <StatCard
            label="Medium"
            value={medium}
            icon="◆"
            gradient="from-yellow-400 to-orange-500"
          />
          <StatCard
            label="Hard"
            value={hard}
            icon="★"
            gradient="from-red-400 to-pink-500"
          />
        </div>

        <div className="mt-4 text-center text-sm text-blue-400 hover:text-blue-300 font-semibold">
          Click to view details →
        </div>
      </div>
    );
  };

  const renderCodeforcesStats = (item) => {
    const {
      rating = 0,
      maxRating = 0,
      rank = "N/A",
      friendOfCount = 0,
      problemsSolved = 0,
      totalContests = 0,
    } = item.stats || {};

    return (
      <div
        key={item._id}
        onClick={() => navigate("/codeforces")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/codeforces");
          }
        }}
        aria-label={`Open ${item.platform} details`}
        className="glass-card-hover p-6 rounded-2xl fade-in-up delay-200 cursor-pointer transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl codeforces-gradient flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              CF
            </div>
            <div>
              <h2 className="text-2xl font-bold neon-text capitalize">
                {item.platform}
              </h2>
              <div className="text-sm text-gray-400">@{item.username}</div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30 relative">
            ● Active
            <button
              onClick={(e) => handleUnlink(item.platform, e)}
              className="absolute left-[-70px] top-[-10px] mt-2 mr-2 text-xs bg-red-600/20 text-red-400 px-3 py-2 rounded-full"
            >
              Unlink
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="stat-value-lg mb-2">{rating.toLocaleString()}</div>
          <div className="stat-label">Current Rating</div>
          <div className="mt-2 text-purple-400 text-sm font-semibold capitalize">
            {rank}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <StatCard label="Max Rating" value={maxRating} icon="🏆" />
          <StatCard
            label="Followers"
            value={friendOfCount.toLocaleString()}
            icon="👥"
          />
          <StatCard
            label="Problems"
            value={problemsSolved.toLocaleString()}
            icon="🎯"
          />
          <StatCard label="Contests" value={totalContests} icon="🏅" />
        </div>

        <div className="mt-4 text-center text-sm text-blue-400 hover:text-blue-300 font-semibold">
          Click to view details →
        </div>
      </div>
    );
  };

  const renderGitHubStats = (item) => {
    const {
      followers = 0,
      following = 0,
      publicRepos = 0,
      publicGists = 0,
      totalStars = 0,
      name = "",
    } = item.stats || {};
    const hasStats = Object.keys(item.stats || {}).length > 0;

    return (
      <div
        key={item._id}
        onClick={() => navigate("/github")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/github");
          }
        }}
        aria-label={`Open ${item.platform} details`}
        className="glass-card-hover p-6 rounded-2xl fade-in-up delay-400 cursor-pointer transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl github-gradient flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              GH
            </div>
            <div>
              <h2 className="text-2xl font-bold neon-text capitalize">
                {item.platform}
              </h2>
              <div className="text-sm text-gray-400">@{item.username}</div>
              {name && (
                <div className="text-xs text-gray-500 mt-0.5">{name}</div>
              )}
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold border border-purple-500/30 relative">
            {hasStats ? "● Active" : "● Loading"}
            <button
              onClick={(e) => handleUnlink(item.platform, e)}
              className="absolute left-[-70px] top-[-10px] mt-2 mr-2 text-xs bg-red-600/20 text-red-400 px-3 py-2 rounded-full"
            >
              Unlink
            </button>
          </div>
        </div>

        {hasStats ? (
          <>
            <div className="mb-4">
              <div className="stat-value-lg mb-2">
                {totalStars.toLocaleString()}
              </div>
              <div className="stat-label">Total Stars</div>
              <div className="text-sm text-gray-400 mt-1">
                {followers.toLocaleString()} followers
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <StatCard label="Repos" value={publicRepos} icon="📦" />
              <StatCard label="Gists" value={publicGists} icon="📝" />
              <StatCard label="Following" value={following} icon="👤" />
              <StatCard
                label="Followers"
                value={followers.toLocaleString()}
                icon="👥"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3 opacity-30">🔄</div>
            <div className="text-gray-400 text-sm">Stats loading...</div>
          </div>
        )}

        <div className="mt-4 text-center text-sm text-blue-400 hover:text-blue-300 font-semibold">
          Click to view details →
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-8 fade-in-scale">
        <h1 className="text-5xl font-black mb-3 neon-text">Dashboard</h1>
        <p className="text-gray-400 text-lg">
          Track your coding journey across platforms
        </p>
      </div>

      {!stats ? (
        <Loader />
      ) : stats.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <div className="text-6xl mb-4 opacity-30">📊</div>
          <h3 className="text-2xl font-bold mb-2 text-gray-300">
            No Stats Yet
          </h3>
          <p className="text-gray-500">
            Link your coding platforms to start tracking
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {stats.map((item) => {
            if (item.platform === "leetcode") return renderLeetCodeStats(item);
            if (item.platform === "codeforces")
              return renderCodeforcesStats(item);
            if (item.platform === "github") return renderGitHubStats(item);
            return null;
          })}
        </div>
      )}

      <Dialog
        open={confirmDialog.open}
        title="Confirm Unlink"
        message={
          confirmDialog.platform
            ? `Are you sure you want to unlink ${confirmDialog.platform}? You can re-add it after 15 days (one-time re-add allowed once).`
            : ""
        }
        confirmText="Unlink"
        cancelText="Cancel"
        onConfirm={doUnlink}
        onCancel={() => setConfirmDialog({ open: false, platform: null })}
      />

      <Dialog
        open={messageDialog.open}
        title={messageDialog.title}
        message={messageDialog.message}
        confirmText="OK"
        cancelText=""
        onConfirm={() =>
          setMessageDialog({ open: false, title: "", message: "" })
        }
        onCancel={() =>
          setMessageDialog({ open: false, title: "", message: "" })
        }
      />
    </>
  );
}
