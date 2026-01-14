import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiShare2, FiExternalLink, FiAward, FiCheckCircle, FiTarget, FiZap, FiActivity } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";
import Loader from "../components/Loader";

// AtCoder text icon component
const AtCoderIcon = ({ className }) => (
  <span className={`font-black text-xs ${className}`}>AT</span>
);

const platformConfig = {
  leetcode: { icon: SiLeetcode, color: "#ffa116", label: "LeetCode", metric: "metrics.totalSolved" },
  codeforces: { icon: SiCodeforces, color: "#1f8acb", label: "Codeforces", metric: "metrics.rating" },
  github: { icon: SiGithub, color: "#ffffff", label: "GitHub", metric: "metrics.totalStars" },
  codechef: { icon: SiCodechef, color: "#5B4638", label: "CodeChef", metric: "metrics.rating" },
  atcoder: { icon: AtCoderIcon, color: "#222222", label: "AtCoder", metric: "metrics.rating" },
};

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setError("Neural link not found for this profile.");
        } else {
          setError("Failed to synchronize with public node.");
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
      alert("Profile neural link copied to clipboard!");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><Loader /></div>;

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <div className="glass-card-premium p-12 text-center max-w-lg fade-in-scale">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <FiZap className="text-4xl text-red-500/50" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 italic">Disconnected</h1>
          <p className="text-gray-400 mb-8 font-medium">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-all uppercase tracking-widest text-xs"
          >
            <FiArrowLeft />
            Return to Core
          </Link>
        </div>
      </div>
    );
  }

  const { profile: userProfile, aggregateStats, platforms, history } = profile;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300 selection:bg-blue-500/30">
      {/* Premium Header */}
      <div className="relative overflow-hidden pt-20 pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(60,80,255,0.05),_transparent_25%)]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-gradient-to-br from-blue-600 to-purple-600 p-1">
                  <div className="w-full h-full rounded-[1.9rem] bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-black text-white opacity-20">
                        {userProfile.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#0a0a0f]">
                  <FiAward className="text-white text-xl" />
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
                  {userProfile.name}
                </h1>
                <p className="text-blue-400 font-black tracking-widest uppercase text-sm mb-6 flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  @{userProfile.username}
                </p>
                
                {userProfile.bio && (
                  <p className="text-gray-400 text-lg font-medium max-w-xl mb-8 leading-relaxed italic">
                    "{userProfile.bio}"
                  </p>
                )}
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                  {userProfile.location && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <FiTarget className="text-blue-500/50" />
                      <span>{userProfile.location}</span>
                    </div>
                  )}
                  {userProfile.website && (
                    <a
                      href={userProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <FiExternalLink />
                      <span>{new URL(userProfile.website).hostname}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleShare}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/5 flex items-center gap-3 backdrop-blur-xl group active:scale-95"
              >
                <FiShare2 className="text-lg group-hover:scale-110 transition-transform" />
                Transmission
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* Aggregate Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard label="Platforms Linked" value={aggregateStats.platforms} icon={<FiLayers className="text-blue-500" />} />
          <StatCard label="Codons Synthesized" value={aggregateStats.totalProblemsSolved} icon={<FiCheckCircle className="text-green-500" />} />
          <StatCard label="Contests Survived" value={aggregateStats.totalContests} icon={<FiActivity className="text-red-500" />} />
          <StatCard label="Engrams unlocked" value={aggregateStats.badges.length} icon={<FiAward className="text-purple-500" />} />
        </div>

        {/* Platforms Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {platforms.map((platform) => {
            const config = platformConfig[platform.platform] || { icon: FiActivity, color: "#666", label: platform.platform, metric: "metrics.totalSolved" };
            const Icon = config.icon;
            const platformHistory = history[platform.platform] || [];
            
            return (
              <div 
                key={platform.platform}
                className="glass-card-premium p-8 group transition-all hover:bg-white/[0.03]"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${config.color}15`, border: `1px solid ${config.color}30` }}
                    >
                      <Icon style={{ color: config.color }} className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{config.label}</h3>
                      <p className="text-blue-500/60 font-black text-[10px] uppercase tracking-widest">@{platform.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">Last Sync</p>
                    <p className="text-white/60 font-bold text-xs">{new Date(platform.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {Object.entries(platform.stats).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-1 line-clamp-1">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-xl font-black text-white">{value}</p>
                    </div>
                  ))}
                </div>

                {platformHistory.length > 1 && (
                  <div className="h-40 mt-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={platformHistory}>
                        <defs>
                          <linearGradient id={`grad-${platform.platform}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis 
                          dataKey="snapshotDate" 
                          hide 
                        />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#0a111b', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey={config.metric}
                          stroke={config.color}
                          strokeWidth={3}
                          fill={`url(#grad-${platform.platform})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Achievement Badges */}
        {aggregateStats.badges.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black mb-10 text-white uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="w-10 h-[1px] bg-blue-500/30" />
              Engram Archives
            </h2>
            <div className="flex flex-wrap gap-4">
              {aggregateStats.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-blue-500/5 hover:border-blue-500/20 transition-all cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl text-blue-400 group-hover:scale-110 transition-transform">
                    {badge.icon || "🎖️"}
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-widest">{badge.label}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{badge.platform}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-40 text-center border-t border-white/5 pt-12">
          <p className="text-gray-600 font-black text-xs uppercase tracking-[0.5em] mb-4">Neural Signal by</p>
          <Link to="/" className="text-3xl font-black text-white italic tracking-tighter hover:text-blue-500 transition-colors">
            DEVLOG<span className="text-blue-500">_</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="glass-card-premium p-8 group transition-all hover:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="w-1 h-1 rounded-full bg-white/20" />
      </div>
      <p className="text-3xl font-black text-white mb-1 group-hover:animate-pulse transition-all">{value}</p>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}
