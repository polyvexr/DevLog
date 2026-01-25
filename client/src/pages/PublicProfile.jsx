import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiShare2, FiCheckCircle, FiAward, FiTarget, FiActivity, FiLayers, FiMapPin, FiGlobe, FiCalendar, FiZap } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";
import api from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";

const AtCoder = ({ className }) => <span className={`font-black text-[10px] ${className}`}>AT</span>;

const platformMeta = {
  leetcode: { icon: SiLeetcode, color: "text-amber-500", bg: "bg-amber-500/10", label: "LeetCode" },
  codeforces: { icon: SiCodeforces, color: "text-blue-500", bg: "bg-blue-500/10", label: "Codeforces" },
  github: { icon: SiGithub, color: "text-white", bg: "bg-white/10", label: "GitHub" },
  codechef: { icon: SiCodechef, color: "text-amber-700", bg: "bg-amber-700/10", label: "CodeChef" },
  atcoder: { icon: AtCoder, color: "text-cyan-400", bg: "bg-cyan-400/10", label: "AtCoder" }
};

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/u/${username}`).then(res => setData(res.data)).catch(err => setError(err.response?.status === 404 ? "Node not found or restricted" : "Neural connection severed")).finally(() => setLoading(false));
  }, [username]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <FullPageLoader />;
  if (error) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
      <div className="glass-card-premium p-12 max-w-lg space-y-8">
        <FiZap className="text-6xl text-red-500 mx-auto animate-pulse" />
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Access <span className="text-red-500">Denied</span></h1>
        <p className="text-gray-500 font-bold">{error}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10"><FiArrowLeft /> Return to Base</Link>
      </div>
    </div>
  );

  const { profile: user, aggregateStats: stats, platforms: linked } = data;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-600/30 font-inter pb-32">
      {/* Bio / Header */}
      <div className="max-w-7xl mx-auto px-6 pt-24 space-y-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="relative group">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[3rem] bg-gradient-to-br from-blue-600 to-purple-600 p-1 shadow-2xl transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-[2.9rem] bg-[#050505] flex items-center justify-center overflow-hidden">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="text-6xl font-black opacity-10 italic">{user.name?.[0]}</span>}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center border-4 border-[#050505]"><FiAward className="text-xl" /></div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">{user.name}</h1>
              {user.role === "admin" && <span className="px-3 py-1 bg-blue-600 text-[8px] font-black uppercase tracking-widest rounded-full">Admin</span>}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-lg">@{user.username}</div>
              <div className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2"><FiCalendar className="text-blue-500/40" /> {new Date(user.memberSince).getFullYear()} Registry</div>
            </div>
            {user.bio && <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl italic leading-relaxed">"{user.bio}"</p>}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4">
              {user.location && <div className="flex items-center gap-2 text-gray-500 text-xs font-bold"><FiMapPin className="text-blue-500" /> {user.location}</div>}
              {user.website && <a href={user.website} target="_blank" className="flex items-center gap-2 text-gray-500 hover:text-blue-400 text-xs font-bold"><FiGlobe className="text-blue-500" /> Portal</a>}
            </div>
          </div>

          <button onClick={copyLink} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${copied ? "bg-green-600 text-white" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}>
            {copied ? <FiCheckCircle className="text-lg mb-1" /> : <FiShare2 className="text-lg mb-1" />}
            {copied ? "Link Copied" : "Share Profile"}
          </button>
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {[
            { l: "Nodes", v: stats.platforms, i: <FiLayers className="text-blue-500" /> },
            { l: "Solved", v: stats.totalProblemsSolved?.toLocaleString(), i: <FiCheckCircle className="text-green-500" /> },
            { l: "Contests", v: stats.totalContests?.toLocaleString(), i: <FiActivity className="text-red-500" /> },
            { l: "Medals", v: stats.badges.length, i: <FiAward className="text-purple-500" /> }
          ].map((m, i) => (
            <div key={i} className="glass-card-premium p-8 group transition-all hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">{m.i}</div>
              <div className="text-3xl font-black italic tracking-tighter mb-1">{m.v}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-500">{m.l}</div>
            </div>
          ))}
        </div>

        {/* Platforms */}
        <div className="pt-24 space-y-12">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 text-center flex items-center gap-6"><div className="flex-1 h-px bg-white/5" /> Linked Ecosystems <div className="flex-1 h-px bg-white/5" /></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {linked.map(p => {
              const meta = platformMeta[p.platform] || { icon: FiActivity, color: "text-white", bg: "bg-white/5", label: p.platform };
              const Icon = meta.icon;
              return (
                <div key={p.platform} className="glass-card-premium p-10 group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${meta.bg} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="flex items-center justify-between mb-10 relative">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl transition-transform group-hover:rotate-12 ${meta.bg}`}><Icon className={`text-2xl ${meta.color}`} /></div>
                      <div>
                        <div className="text-2xl font-black italic uppercase tracking-tighter">{meta.label}</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-500">@{p.username}</div>
                      </div>
                    </div>
                    <div className="text-right opacity-30 group-hover:opacity-100 transition-opacity">
                      <div className="text-[8px] font-black uppercase tracking-widest">Registry Sync</div>
                      <div className="text-[9px] font-bold">{new Date(p.lastUpdated).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 relative">
                    {Object.entries(p.stats).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="p-4 bg-white/5 border border-white/5 rounded-2xl group/stat hover:bg-white/10 transition-colors">
                        <div className="text-xl font-black italic mb-1">{typeof v === 'number' ? v.toLocaleString() : v}</div>
                        <div className="text-[7px] font-black uppercase tracking-widest text-gray-600 group-hover/stat:text-blue-500 transition-colors truncate">{k.replace(/([A-Z])/g, " $1")}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-40 text-center opacity-30">
          <Link to="/" className="text-2xl font-black italic tracking-tighter hover:text-blue-500 transition-colors">DEVLOG<span className="text-blue-600">_</span></Link>
          <div className="text-[8px] font-black uppercase tracking-[0.5em] mt-4">Developer Identity Terminal © 2026</div>
        </div>
      </div>
    </div>
  );
}
