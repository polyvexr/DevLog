import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiShare2,
  FiExternalLink,
  FiAward,
  FiCheckCircle,
  FiTarget,
  FiZap,
  FiActivity,
  FiLayers,
  FiMapPin,
  FiGlobe,
  FiCalendar
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";
import api from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";

// AtCoder text icon component
const AtCoderIcon = ({ className }) => (
  <span className={`font-black text-xs ${className}`}>AT</span>
);

const platformConfig = {
  leetcode: {
    icon: SiLeetcode,
    color: "#ffa116",
    label: "LeetCode",
    bg: "bg-[#ffa116]/10",
    border: "border-[#ffa116]/20",
    text: "text-[#ffa116]"
  },
  codeforces: {
    icon: SiCodeforces,
    color: "#1f8acb",
    label: "Codeforces",
    bg: "bg-[#1f8acb]/10",
    border: "border-[#1f8acb]/20",
    text: "text-[#1f8acb]"
  },
  github: {
    icon: SiGithub,
    color: "#ffffff",
    label: "GitHub",
    bg: "bg-[#ffffff]/10",
    border: "border-[#ffffff]/20",
    text: "text-white"
  },
  codechef: {
    icon: SiCodechef,
    color: "#5B4638",
    label: "CodeChef",
    bg: "bg-[#5B4638]/20",
    border: "border-[#5B4638]/30",
    text: "text-[#5B4638]"
  },
  atcoder: {
    icon: AtCoderIcon,
    color: "#222222",
    label: "AtCoder",
    bg: "bg-[#ffffff]/5",
    border: "border-[#ffffff]/10",
    text: "text-white"
  },
};

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/u/${username}`);
        if (response.data.success) {
          setProfile(response.data);
        }
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Profile not found or set to private.");
        } else {
          setError("Failed to load profile. Connection interrupted.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.profile.name}'s DevLog Profile`,
          url,
        });
      } catch {
        // Silently fail if share fails
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <FullPageLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-red-500/30">
        <div className="glass-card-premium p-12 text-center max-w-lg fade-in-scale border-none ring-1 ring-white/5">
          <div className="w-24 h-24 bg-red-600/10 border border-red-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl pulse-ring">
            <FiZap className="text-5xl text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 italic uppercase tracking-tighter">Access <span className="text-red-500">Denied</span></h1>
          <p className="text-gray-500 mb-10 font-medium leading-relaxed">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-[10px] border border-white/10"
          >
            <FiArrowLeft className="text-lg" />
            Back to Base
          </Link>
        </div>
      </div>
    );
  }

  const { profile: userProfile, aggregateStats, platforms } = profile;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 selection:bg-blue-600/30 font-inter">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow delay-700"></div>
      </div>

      {/* Profile Header */}
      <div className="relative pt-24 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
            <div className="flex-1 flex flex-col md:flex-row items-center md:items-center gap-10">
              {/* Avatar Container */}
              <div className="relative group">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-[2px] shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full rounded-[2.9rem] bg-[#050505] flex items-center justify-center overflow-hidden">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-7xl font-black text-white opacity-20 italic">
                        {userProfile.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-blue-600 rounded-[1.2rem] flex items-center justify-center shadow-2xl border-[6px] border-[#050505] group-hover:rotate-12 transition-transform">
                  <FiAward className="text-white text-2xl" />
                </div>
              </div>

              {/* User Identity */}
              <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none mb-0">
                    {userProfile.name}
                  </h1>
                  {userProfile.role === "admin" && (
                    <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">System Admin</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl">
                    <FiTarget className="text-xs" /> @{userProfile.username}
                  </div>
                  <div className="text-gray-500 font-bold text-xs flex items-center gap-2">
                    <FiCalendar className="text-blue-500/50" /> Joined {new Date(userProfile.memberSince).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
                  </div>
                </div>

                {userProfile.bio && (
                  <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mb-10 leading-relaxed italic opacity-80 decoration-blue-500/30 underline-offset-4 decoration-2">
                    "{userProfile.bio}"
                  </p>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-8">
                  {userProfile.location && (
                    <div className="flex items-center gap-3 text-gray-500 group">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                        <FiMapPin className="text-blue-500/60" />
                      </div>
                      <span className="text-sm font-bold tracking-wide">{userProfile.location}</span>
                    </div>
                  )}
                  {userProfile.website && (
                    <a
                      href={userProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-500 group hover:text-blue-400 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                        <FiGlobe className="text-blue-500/60" />
                      </div>
                      <span className="text-sm font-bold tracking-wide truncate max-w-[200px]">{new URL(userProfile.website).hostname}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 self-center md:self-start">
              <button
                onClick={handleShare}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${copied
                  ? "bg-green-600 text-white"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-xl"
                  }`}
              >
                {copied ? <FiCheckCircle className="text-lg" /> : <FiShare2 className="text-lg" />}
                {copied ? "Link Copied!" : "Share Registry"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24 z-10 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-fade-in">
          <MetricCard label="Nodes Connected" value={aggregateStats.platforms} icon={<FiLayers className="text-blue-500" />} />
          <MetricCard label="Solutions Synthesized" value={aggregateStats.totalProblemsSolved?.toLocaleString()} icon={<FiCheckCircle className="text-green-500" />} />
          <MetricCard label="Battle Participation" value={aggregateStats.totalContests?.toLocaleString()} icon={<FiActivity className="text-red-500" />} />
          <MetricCard label="Neural Medals" value={aggregateStats.badges.length} icon={<FiAward className="text-purple-500" />} />
        </div>

        {/* Platforms Showcase */}
        <div className="mb-24">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-10 flex items-center gap-6">
            <div className="h-px bg-white/5 flex-1"></div>
            Linked Ecosystems
            <div className="h-px bg-white/5 flex-1"></div>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {platforms.map((platform) => {
              const cfg = platformConfig[platform.platform] || {
                icon: FiActivity,
                color: "#666",
                label: platform.platform,
                bg: "bg-white/5",
                border: "border-white/10",
                text: "text-white"
              };
              const Icon = cfg.icon;
              return (
                <div
                  key={platform.platform}
                  className="glass-card-premium p-10 group relative overflow-hidden transition-all hover:-translate-y-1"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${cfg.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex items-center gap-6">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl border transition-transform group-hover:rotate-12 ${cfg.bg} ${cfg.border}`}
                      >
                        <Icon style={{ color: cfg.color }} className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white italic truncate">{cfg.label}</h3>
                        <p className={`${cfg.text} opacity-60 font-black text-[10px] uppercase tracking-[0.2em]`}>@{platform.username}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">Registry Pulse</div>
                      <p className="text-white/40 font-bold text-[10px]">{new Date(platform.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 relative z-10">
                    {Object.entries(platform.stats).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2 truncate">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="text-2xl font-black text-white italic">{typeof value === 'number' ? value.toLocaleString() : value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Section */}
        {aggregateStats.badges.length > 0 && (
          <div className="fade-in-up">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-10 flex items-center gap-6">
              <div className="h-px bg-white/5 flex-1"></div>
              Neural Medals Earned
              <div className="h-px bg-white/5 flex-1"></div>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {aggregateStats.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="glass-card-premium p-6 flex items-center gap-5 group hover:bg-blue-600/5 hover:ring-1 hover:ring-blue-500/20 transition-all border-none ring-1 ring-white/5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/10 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    {badge.icon || "🎖️"}
                  </div>
                  <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">{badge.label}</h4>
                    <p className="text-[8px] text-blue-500/60 font-black uppercase tracking-widest">{badge.platform}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Footer */}
        <div className="mt-40 text-center border-t border-white/5 pt-16">
          <p className="text-gray-700 font-black text-[10px] uppercase tracking-[0.8em] mb-6">Neural Identity Tracked via</p>
          <Link to="/" className="inline-block group">
            <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter group-hover:text-blue-500 transition-colors">
              DEVLOG<span className="text-blue-600 group-hover:animate-pulse">_</span>
            </h2>
          </Link>
          <div className="mt-8 text-gray-800 text-[10px] font-black uppercase tracking-widest">
            © 2026 Developer Command Center
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }) {
  return (
    <div className="glass-card-premium p-10 group relative transition-all border-none ring-1 ring-white/5 active:scale-[0.98]">
      <div className="flex items-center justify-between mb-8">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-inner">
          {icon}
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
      </div>
      <div className="text-4xl font-black text-white mb-2 italic tracking-tighter group-hover:translate-x-1 transition-transform">{value || 0}</div>
      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-60">{label}</div>
    </div>
  );
}
