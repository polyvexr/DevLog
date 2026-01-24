import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { FiUsers, FiRefreshCw, FiShield, FiCheckCircle, FiAlertCircle, FiActivity, FiTerminal, FiDatabase, FiX, FiCalendar } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";

const AtCoder = ({ className }) => <span className={`font-black text-xs ${className}`}>AT</span>;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sync, setSync] = useState({ active: "", results: null, contest: false });
  const [stats, setStats] = useState(null);
  const [notif, setNotif] = useState(null);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/stats");
      setStats(res.data.data);
    } catch (err) {
      notify("error", err.response?.data?.message || "Failed to fetch stats");
    } finally { setLoading(false); }
  };

  const notify = (type, message) => {
    setNotif({ type, message });
    setTimeout(() => setNotif(null), 5000);
  };

  const handleSync = async (platform) => {
    try {
      setSync({ ...sync, active: platform, results: null });
      const res = await api.post(platform === "all" ? "/admin/sync/all" : `/admin/sync/${platform}`, {}, { timeout: 120000 });
      const results = platform === "all" ? res.data.data.totals : res.data.data.results;
      if (platform === "all") {
        results.details = Object.values(res.data.data.platforms).flatMap(p => p.details || []);
      }
      setSync({ ...sync, active: "", results });
      fetchStats();
      notify("success", `Sync Success: ${results.success} updated`);
    } catch (err) {
      notify("error", "Sync protocol failed");
      setSync({ ...sync, active: "" });
    }
  };

  const syncContests = async () => {
    try {
      setSync({ ...sync, contest: true });
      const res = await api.post("/cron/contests");
      notify("success", `Contests Updated: ${res.data.totalFetched || 0} items`);
    } catch {
      notify("error", "Contest sync sequence failed");
    } finally { setSync({ ...sync, contest: false }); }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  const cards = [
    { p: "leetcode", icon: SiLeetcode, color: "text-yellow-500", label: "LeetCode" },
    { p: "codeforces", icon: SiCodeforces, color: "text-green-400", label: "Codeforces" },
    { p: "github", icon: SiGithub, color: "text-purple-400", label: "GitHub" },
    { p: "codechef", icon: SiCodechef, color: "text-amber-500", label: "CodeChef" },
    { p: "atcoder", icon: AtCoder, color: "text-cyan-400", label: "AtCoder" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-16">
      {/* Notification */}
      {notif && (
        <div className={`fixed top-24 right-6 z-50 p-5 rounded-xl flex items-center gap-4 glass-card-premium border-none ring-1 ${notif.type === "error" ? "ring-red-500/30 text-red-400" : "ring-green-500/30 text-green-400"}`}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${notif.type === "error" ? "bg-red-500 shadow-[0_0_10px_red]" : "bg-green-500 shadow-[0_0_10px_green]"}`} />
          <span className="font-bold">{notif.message}</span>
          <button onClick={() => setNotif(null)} className="ml-4 opacity-50 hover:opacity-100"><FiX /></button>
        </div>
      )}

      {/* Header */}
      <div className="fade-in-scale">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6"><FiShield /> Admin Mode</div>
        <h1 className="text-6xl md:text-8xl font-black italic mb-4 tracking-tighter">System <span className="animate-text-shine">Admin</span></h1>
        <p className="text-gray-400 text-lg font-medium max-w-2xl">Infrastructure management and global synchronization terminal.</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="lg:col-span-1 glass-card-premium p-8 relative overflow-hidden group">
            <FiUsers className="absolute -right-4 -top-4 text-7xl text-blue-500/5" />
            <div className="text-4xl font-black text-white mb-2">{stats.totalUsers}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Total Users</div>
            <button onClick={() => navigate("/admin/users")} className="w-full py-2.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 hover:text-white transition-all">List Users</button>
          </div>
          {cards.map(c => (
            <div key={c.p} className="glass-card-premium p-8 relative overflow-hidden">
              <c.icon className={`absolute -right-4 -top-4 text-6xl ${c.color} opacity-5`} />
              <div className={`text-4xl font-black ${c.color} mb-2`}>{stats.platformCounts[c.p]}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{c.label} Accounts</div>
            </div>
          ))}
        </div>
      )}

      {/* Sync Controls */}
      <div className="glass-card-premium p-10 space-y-12">
        <div className="flex items-center gap-6">
          <FiRefreshCw className={`text-3xl text-blue-500 ${sync.active ? 'animate-spin' : ''}`} />
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Platform Sync</h2>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Global user data refresh protocol</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[{ id: "all", label: "Global", icon: FiActivity, color: "text-blue-500" }, ...cards.map(c => ({ id: c.p, label: c.label, icon: c.icon, color: c.color }))].map(i => (
            <button key={i.id} onClick={() => handleSync(i.id)} disabled={!!sync.active} className={`group glass-card-premium p-6 text-left transition-all hover:ring-1 hover:ring-white/20 active:scale-95 ${sync.active === i.id ? 'ring-2 ring-blue-500' : ''}`}>
              <i.icon className={`text-2xl mb-4 ${i.color}`} />
              <div className="text-lg font-black text-white italic leading-tight">{i.label}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">{sync.active === i.id ? 'Syncing...' : 'Start'}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Contest Update & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card-premium p-10 space-y-8">
          <div className="flex items-center gap-4">
            <FiCalendar className={`text-2xl text-purple-500 ${sync.contest ? 'animate-pulse' : ''}`} />
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Contest Updates</h3>
          </div>
          <button onClick={syncContests} disabled={sync.contest} className="w-full p-6 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center gap-4 hover:bg-purple-600 hover:text-white transition-all group">
            <FiRefreshCw className={`text-xl ${sync.contest ? 'animate-spin' : 'group-hover:rotate-180 transition-all duration-500'}`} />
            <div className="text-left">
              <div className="text-lg font-black italic">Fetch New Lists</div>
              <div className="text-[9px] font-black uppercase tracking-widest opacity-60">LeetCode, CF, CodeChef, AtCoder</div>
            </div>
          </button>
        </div>

        {stats?.recentSyncs && (
          <div className="glass-card-premium p-10 space-y-8 h-full">
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4"><FiActivity className="text-green-500" /> Recent Log</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
              {stats.recentSyncs.slice(0, 5).map((s, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <div className="text-[10px] font-black text-white">{s.userId?.email || "System"}</div>
                    <div className="text-[8px] font-black uppercase text-gray-500 tracking-widest">{s.platform}</div>
                  </div>
                  <div className="text-[9px] font-black text-gray-600 italic">{new Date(s.lastUpdated).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
