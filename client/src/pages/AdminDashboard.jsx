import { useState, useEffect } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [stats, setStats] = useState(null);
  const [syncResults, setSyncResults] = useState(null);
  const [activeSync, setActiveSync] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/stats");
      setStats(res.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch stats",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (platform) => {
    try {
      setSyncing(true);
      setActiveSync(platform);
      setSyncResults(null);

      let endpoint = "/admin/sync/all";
      if (platform === "leetcode") endpoint = "/admin/sync/leetcode";
      else if (platform === "codeforces") endpoint = "/admin/sync/codeforces";
      else if (platform === "github") endpoint = "/admin/sync/github";

      const res = await api.post(endpoint);
      setSyncResults(res.data.results);

      // Refresh stats after sync
      await fetchStats();
      setNotification({
        type: "success",
        message: `${res.data.message} - Success: ${res.data.results.success}, Failed: ${res.data.results.failed}`,
      });
    } catch (error) {
      console.error("Error syncing:", error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Failed to sync data",
      });
    } finally {
      setSyncing(false);
      setActiveSync("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "error"
              ? "bg-red-900/80 text-red-200"
              : "bg-green-900/80 text-green-200"
          }`}
          role="status"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 text-sm">{notification.message}</div>
            <button
              onClick={() => setNotification(null)}
              className="text-sm opacity-80 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-[var(--text-primary)] mb-4">
            Admin Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Manage and sync platform data for all users
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="platform-card p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-[var(--accent-blue)] mb-2">
                {stats.totalUsers}
              </div>
              <div className="text-[var(--text-secondary)]">Total Users</div>
            </div>
            <div className="platform-card p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {stats.platformCounts.leetcode}
              </div>
              <div className="text-[var(--text-secondary)]">LeetCode Users</div>
            </div>
            <div className="platform-card p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {stats.platformCounts.codeforces}
              </div>
              <div className="text-[var(--text-secondary)]">
                Codeforces Users
              </div>
            </div>
            <div className="platform-card p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {stats.platformCounts.github}
              </div>
              <div className="text-[var(--text-secondary)]">GitHub Users</div>
            </div>
          </div>
        )}

        {/* Sync Controls */}
        <div className="platform-card p-8 rounded-2xl mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            Sync Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleSync("all")}
              disabled={syncing}
              className={`p-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                syncing && activeSync === "all"
                  ? "bg-[var(--accent-blue)]/50 cursor-wait"
                  : "btn-primary"
              } disabled:opacity-50`}
            >
              {syncing && activeSync === "all" ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Syncing...
                </div>
              ) : (
                "Sync All Platforms"
              )}
            </button>

            <button
              onClick={() => handleSync("leetcode")}
              disabled={syncing}
              className={`p-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                syncing && activeSync === "leetcode"
                  ? "bg-yellow-600/50 cursor-wait"
                  : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/50"
              } text-white disabled:opacity-50`}
            >
              {syncing && activeSync === "leetcode" ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Syncing...
                </div>
              ) : (
                "Sync LeetCode"
              )}
            </button>

            <button
              onClick={() => handleSync("codeforces")}
              disabled={syncing}
              className={`p-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                syncing && activeSync === "codeforces"
                  ? "bg-green-600/50 cursor-wait"
                  : "bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg hover:shadow-green-500/50"
              } text-white disabled:opacity-50`}
            >
              {syncing && activeSync === "codeforces" ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Syncing...
                </div>
              ) : (
                "Sync Codeforces"
              )}
            </button>

            <button
              onClick={() => handleSync("github")}
              disabled={syncing}
              className={`p-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                syncing && activeSync === "github"
                  ? "bg-purple-600/50 cursor-wait"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50"
              } text-white disabled:opacity-50`}
            >
              {syncing && activeSync === "github" ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Syncing...
                </div>
              ) : (
                "Sync GitHub"
              )}
            </button>
          </div>
        </div>

        {/* Sync Results */}
        {syncResults && (
          <div className="platform-card p-8 rounded-2xl mb-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
              Last Sync Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-[var(--bg-card-inner)] rounded-xl text-center">
                <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                  {syncResults.total}
                </div>
                <div className="text-[var(--text-secondary)]">Total</div>
              </div>
              <div className="p-4 bg-green-900/30 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {syncResults.success}
                </div>
                <div className="text-[var(--text-secondary)]">Success</div>
              </div>
              <div className="p-4 bg-red-900/30 rounded-xl text-center">
                <div className="text-3xl font-bold text-red-400 mb-1">
                  {syncResults.failed}
                </div>
                <div className="text-[var(--text-secondary)]">Failed</div>
              </div>
            </div>

            {/* Detailed Results */}
            {syncResults.details && syncResults.details.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                  Detailed Results
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-[var(--bg-card-inner)]">
                      <tr className="border-b border-[var(--border-color)]">
                        <th className="p-3 text-[var(--text-secondary)]">
                          User
                        </th>
                        <th className="p-3 text-[var(--text-secondary)]">
                          Platform/Username
                        </th>
                        <th className="p-3 text-[var(--text-secondary)]">
                          Status
                        </th>
                        <th className="p-3 text-[var(--text-secondary)]">
                          Error
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {syncResults.details.map((detail, index) => (
                        <tr
                          key={index}
                          className="border-b border-[var(--border-color)] hover:bg-[var(--bg-card-inner)]"
                        >
                          <td className="p-3 text-[var(--text-primary)]">
                            {detail.user}
                          </td>
                          <td className="p-3 text-[var(--text-primary)]">
                            {detail.platform || detail.username || "-"}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                detail.status === "success"
                                  ? "bg-green-900/50 text-green-400"
                                  : "bg-red-900/50 text-red-400"
                              }`}
                            >
                              {detail.status}
                            </span>
                          </td>
                          <td className="p-3 text-red-400 text-sm">
                            {detail.error || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Syncs */}
        {stats?.recentSyncs && stats.recentSyncs.length > 0 && (
          <div className="platform-card p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
              Recent Syncs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="p-3 text-[var(--text-secondary)]">User</th>
                    <th className="p-3 text-[var(--text-secondary)]">
                      Platform
                    </th>
                    <th className="p-3 text-[var(--text-secondary)]">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSyncs.map((sync, index) => (
                    <tr
                      key={index}
                      className="border-b border-[var(--border-color)] hover:bg-[var(--bg-card-inner)]"
                    >
                      <td className="p-3 text-[var(--text-primary)]">
                        {sync.userId?.email || "Unknown"}
                      </td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]">
                          {sync.platform}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--text-secondary)]">
                        {new Date(sync.lastUpdated).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
