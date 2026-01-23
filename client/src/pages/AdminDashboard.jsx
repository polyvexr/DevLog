import { useState, useEffect } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import {
  FiUsers,
  FiRefreshCw,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiActivity,
  FiTerminal,
  FiDatabase,
  FiX,
  FiCalendar
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

const AtCoderIcon = ({ className }) => (
  <span className={`font-black text-xs ${className}`}>AT</span>
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [stats, setStats] = useState(null);
  const [syncResults, setSyncResults] = useState(null);
  const [activeSync, setActiveSync] = useState("");
  const [notification, setNotification] = useState(null);
  const [contestSyncing, setContestSyncing] = useState(false);
  const [contestResults, setContestResults] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/stats");
      setStats(res.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || "System error: Failed to fetch dashboard data.",
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

      const endpoint = platform === "all" ? "/admin/sync/all" : `/admin/sync/${platform}`;

      // Use longer timeout for sync operations (can take up to 2 minutes with slow APIs)
      const res = await api.post(endpoint, {}, { timeout: 120000 });

      let results;
      if (platform === "all") {
        results = res.data.data.totals;
        // Collect all details from all platforms for the table
        const allDetails = [];
        if (res.data.data.platforms) {
          Object.values(res.data.data.platforms).forEach(p => {
            if (p.details) allDetails.push(...p.details);
          });
        }
        results.details = allDetails;
      } else {
        results = res.data.data.results;
      }

      setSyncResults(results);

      await fetchStats();
      setNotification({
        type: "success",
        message: `Sync Completed: ${results.success} accounts updated successfully.`,
      });
    } catch (error) {
      console.error("Error syncing:", error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Sync Error: Could not complete synchronization.",
      });
    } finally {
      setSyncing(false);
      setActiveSync("");
    }
  };

  const handleContestSync = async () => {
    try {
      setContestSyncing(true);
      setContestResults(null);

      const res = await api.post("/cron/contests");
      const platforms = res.data.platforms;
      setContestResults(platforms);

      const totalFetched = res.data.totalFetched ||
        (platforms ? Object.values(platforms).reduce((sum, r) => sum + (r.fetched || 0), 0) : 0);

      setNotification({
        type: "success",
        message: `Contests Updated: ${totalFetched} items fetched successfully.`,
      });
    } catch (error) {
      console.error("Error syncing contests:", error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || error.response?.data?.error || "Update Failed: Unable to fetch contest lists.",
      });
    } finally {
      setContestSyncing(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[150px] -mr-48 -mt-48 animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 blur-[150px] -ml-48 -mb-48 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {notification && (
        <div className="fixed top-24 right-6 z-50 animate-fade-in-scale">
          <div className={`glass-card-premium p-5 flex items-center gap-4 border-none ring-1 ${notification.type === "error" ? "ring-red-500/30 text-red-400" : "ring-green-500/30 text-green-400"
            }`}>
            <div className={`w-3 h-3 rounded-full animate-pulse ${notification.type === "error" ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"}`} />
            <span className="font-bold tracking-wide">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
              <FiX className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-16 fade-in-scale text-center md:text-left">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-6">
          <FiShield className="animate-pulse" /> Admin Mode Active
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none italic">
          System <span className="animate-text-shine">Admin</span>
        </h1>
        <p className="text-gray-400 text-xl font-medium max-w-2xl">Manage users, synchronize platform data, and update contest schedules across the entire system.</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="glass-card-premium p-10 relative overflow-hidden group">
            <FiUsers className="absolute -right-4 -top-4 text-7xl text-blue-500/5 group-hover:text-blue-500/10 transition-colors" />
            <div className="text-4xl font-black text-white mb-2">{stats.totalUsers}</div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-500">Total Users</div>
          </div>
          <div className="glass-card-premium p-10 relative overflow-hidden group">
            <SiLeetcode className="absolute -right-4 -top-4 text-7xl text-yellow-500/5 group-hover:text-yellow-500/10 transition-colors" />
            <div className="text-4xl font-black text-yellow-500 mb-2">{stats.platformCounts.leetcode}</div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-500">LeetCode Accounts</div>
          </div>
          <div className="glass-card-premium p-10 relative overflow-hidden group">
            <SiCodeforces className="absolute -right-4 -top-4 text-7xl text-green-500/5 group-hover:text-green-500/10 transition-colors" />
            <div className="text-4xl font-black text-green-400 mb-2">{stats.platformCounts.codeforces}</div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-500">Codeforces Accounts</div>
          </div>
          <div className="glass-card-premium p-10 relative overflow-hidden group">
            <SiGithub className="absolute -right-4 -top-4 text-7xl text-purple-500/5 group-hover:text-purple-500/10 transition-colors" />
            <div className="text-4xl font-black text-purple-400 mb-2">{stats.platformCounts.github}</div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-500">GitHub Accounts</div>
          </div>
          <div className="glass-card-premium p-10 relative overflow-hidden group">
            <SiCodechef className="absolute -right-4 -top-4 text-7xl text-amber-500/5 group-hover:text-amber-500/10 transition-colors" />
            <div className="text-4xl font-black text-amber-500 mb-2">{stats.platformCounts.codechef}</div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-500">CodeChef Accounts</div>
          </div>
          <div className="glass-card-premium p-10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-7xl text-cyan-500/5 group-hover:text-cyan-500/10 transition-colors">
              <AtCoderIcon className="text-5xl" />
            </div>
            <div className="text-4xl font-black text-cyan-400 mb-2">{stats.platformCounts.atcoder}</div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-500">AtCoder Accounts</div>
          </div>
        </div>
      )}

      {/* Sync Controls */}
      <div className="glass-card-premium p-10 mb-16 border-none ring-1 ring-white/5 relative overflow-hidden">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
            <FiRefreshCw className={`text-3xl text-blue-500 ${syncing ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white italic">Platform Sync</h2>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Refresh data for all users</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: "all", label: "Global Sync", icon: FiActivity, ring: "ring-blue-500/10", hover: "hover:ring-blue-500/40", text: "text-blue-500" },
            { id: "leetcode", label: "LeetCode", icon: SiLeetcode, ring: "ring-yellow-500/10", hover: "hover:ring-yellow-500/40", text: "text-yellow-500" },
            { id: "codeforces", label: "Codeforces", icon: SiCodeforces, ring: "ring-green-500/10", hover: "hover:ring-green-500/40", text: "text-green-500" },
            { id: "github", label: "GitHub", icon: SiGithub, ring: "ring-purple-500/10", hover: "hover:ring-purple-500/40", text: "text-purple-500" },
            { id: "codechef", label: "CodeChef", icon: SiCodechef, ring: "ring-amber-500/10", hover: "hover:ring-amber-500/40", text: "text-amber-500" },
            { id: "atcoder", label: "AtCoder", icon: AtCoderIcon, ring: "ring-cyan-500/10", hover: "hover:ring-cyan-500/40", text: "text-cyan-500" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSync(item.id)}
              disabled={syncing}
              className={`group glass-card-premium p-6 border-none ring-1 text-left transition-all active:scale-95 ${syncing && activeSync === item.id ? 'ring-blue-500 ring-2' : `${item.ring} ${item.hover}`
                }`}
            >
              <item.icon className={`text-3xl mb-4 ${item.text} group-hover:scale-110 transition-transform`} />
              <div className="text-xl font-black text-white italic mb-1">{item.label}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {syncing && activeSync === item.id ? 'Connecting...' : 'Start Sync'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contest Data Sync */}
      <div className="glass-card-premium p-10 mb-16 border-none ring-1 ring-white/5 relative overflow-hidden">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-inner">
            <FiCalendar className={`text-3xl text-purple-500 ${contestSyncing ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white italic">Contest Schedule Update</h2>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Fetch Latest Contests from Supported Platforms</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <button
            onClick={handleContestSync}
            disabled={contestSyncing}
            className={`group glass-card-premium px-8 py-6 border-none ring-1 text-left transition-all active:scale-95 ${contestSyncing ? 'ring-purple-500 ring-2' : 'ring-purple-500/10 hover:ring-purple-500/40'
              }`}
          >
            <div className="flex items-center gap-4">
              <FiRefreshCw className={`text-2xl text-purple-500 ${contestSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <div>
                <div className="text-xl font-black text-white italic mb-1">Fetch Contest Data</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {contestSyncing ? 'Fetching from all platforms...' : 'LeetCode • Codeforces • CodeChef • AtCoder'}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Contest Sync Results */}
        {contestResults && (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-up">
            {Object.entries(contestResults).map(([platform, result]) => (
              <div key={platform} className="glass-card-premium p-6 border-none ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-black uppercase tracking-wider text-gray-400">{platform}</span>
                  {result.error ? (
                    <FiAlertCircle className="text-red-500" />
                  ) : (
                    <FiCheckCircle className="text-green-500" />
                  )}
                </div>
                <div className={`text-3xl font-black ${result.error ? 'text-red-400' : 'text-white'}`}>
                  {result.error ? 'Error' : result.fetched}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">
                  {result.error ? result.error.slice(0, 20) + '...' : 'Contests Fetched'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sync Results Visualization */}
      {syncResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 fade-in-up">
          <div className="lg:col-span-2 glass-card-premium p-10 border-none ring-1 ring-white/5 h-full">
            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 italic uppercase tracking-wider">
              <FiDatabase className="text-blue-500" /> Sync Summary
            </h3>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-2">{syncResults.total}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-green-500 mb-2">{syncResults.success}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Success</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-red-500 mb-2">{syncResults.failed}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Failed</div>
              </div>
            </div>

            {syncResults.details && syncResults.details.length > 0 && (
              <div className="mt-16">
                <div className="max-h-96 overflow-y-auto custom-scrollbar pr-4">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/50 backdrop-blur-xl z-10 border-b border-white/5">
                      <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        <th className="py-4 text-left px-4">User</th>
                        <th className="py-4 text-left px-4">Platform</th>
                        <th className="py-4 text-center px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {syncResults.details.map((detail, index) => (
                        <tr key={index} className="group hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-bold text-gray-300">{detail.user}</td>
                          <td className="py-4 px-4 text-sm font-medium text-gray-500">{detail.platform || detail.username || "-"}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${detail.status === "success"
                                ? "bg-green-500/5 text-green-500 border-green-500/20"
                                : "bg-red-500/5 text-red-500 border-red-500/20"
                              }`}>
                              {detail.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card-premium p-10 border-none ring-1 ring-white/5 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-8 pulse-ring">
              <FiTerminal className="text-4xl text-blue-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 italic">System Health</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Current system state is stable. All synchronization protocols are active and ready.
            </p>
          </div>
        </div>
      )}

      {/* Recent Activity Table */}
      {stats?.recentSyncs && stats.recentSyncs.length > 0 && (
        <div className="glass-card-premium p-10 border-none ring-1 ring-white/5 fade-in-up delay-200">
          <h3 className="text-2xl font-black text-white mb-10 italic uppercase tracking-wider flex items-center gap-4">
            <FiActivity className="text-purple-500" /> Recent Activity Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                  <th className="py-6 px-4">User Email</th>
                  <th className="py-6 px-4">Platform</th>
                  <th className="py-6 px-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentSyncs.map((sync, index) => (
                  <tr key={index} className="group hover:bg-white/5 transition-colors">
                    <td className="py-6 px-4 font-black text-white italic">{sync.userId?.email || "Ghost Node"}</td>
                    <td className="py-6 px-4">
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/5 text-blue-400 border border-blue-500/10">
                        {sync.platform}
                      </span>
                    </td>
                    <td className="py-6 px-4 text-xs font-bold text-gray-500">
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
  );
}
