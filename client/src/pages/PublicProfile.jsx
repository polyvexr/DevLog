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
  FiCalendar,
  FiTrendingUp,
  FiCode,
  FiStar,
  FiGithub as FiGithubIcon
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
    text: "text-[#ffa116]",
    gradient: "from-[#ffa116] to-[#ffb84d]",
    url: (username) => `https://leetcode.com/u/${username}`
  },
  codeforces: {
    icon: SiCodeforces,
    color: "#1f8acb",
    label: "Codeforces",
    bg: "bg-[#1f8acb]/10",
    border: "border-[#1f8acb]/20",
    text: "text-[#1f8acb]",
    gradient: "from-[#1f8acb] to-[#4cb3f0]",
    url: (username) => `https://codeforces.com/profile/${username}`
  },
  github: {
    icon: SiGithub,
    color: "#ffffff",
    label: "GitHub",
    bg: "bg-[#ffffff]/10",
    border: "border-[#ffffff]/20",
    text: "text-white",
    gradient: "from-[#333] to-[#666]",
    url: (username) => `https://github.com/${username}`
  },
  codechef: {
    icon: SiCodechef,
    color: "#5B4638",
    label: "CodeChef",
    bg: "bg-[#5B4638]/20",
    border: "border-[#5B4638]/30",
    text: "text-[#5B4638]",
    gradient: "from-[#5B4638] to-[#8B7355]",
    url: (username) => `https://www.codechef.com/users/${username}`
  },
  atcoder: {
    icon: AtCoderIcon,
    color: "#ffffff",
    label: "AtCoder",
    bg: "bg-[#ffffff]/5",
    border: "border-[#ffffff]/10",
    text: "text-white",
    gradient: "from-[#222] to-[#444]",
    url: (username) => `https://atcoder.jp/users/${username}`
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
            className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all hover:bg-blue-600 hover:border-blue-500 hover:scale-110 shadow-2xl active:scale-95 group"
            title="Back to Base"
          >
            <FiArrowLeft className="text-2xl group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  const { profile: userProfile, aggregateStats, platforms } = profile;

  // Calculate total contest count across all platforms
  const totalContests = platforms.reduce((acc, p) => {
    const s = p.stats || {};
    if (p.platform === "leetcode") return acc + (s.contestRanking?.attendedContestsCount || 0);
    if (p.platform === "codeforces") return acc + (s.totalContests || 0);
    if (p.platform === "codechef") return acc + (s.contestsParticipated || 0);
    if (p.platform === "atcoder") return acc + (s.contestsParticipated || 0);
    return acc;
  }, 0);

  // Get highest rating across all platforms
  const maxRating = Math.max(...platforms.map(p => {
    const s = p.stats || {};
    if (p.platform === "leetcode") return s.contestRanking?.rating || 0;
    if (p.platform === "codeforces") return s.rating || 0;
    if (p.platform === "codechef") return s.rating || 0;
    if (p.platform === "atcoder") return s.rating || 0;
    return 0;
  }), 0);

  const totalGithubStars = platforms.reduce((acc, p) => {
    if (p.platform === "github") return acc + (p.stats?.totalStars || 0);
    return acc;
  }, 0);

  // Calculate Most Used Language from all platforms (favoring GitHub/LeetCode)
  const languageCounts = {};
  platforms.forEach(p => {
    if (p.platform === "leetcode" && p.stats?.languageStats) {
      p.stats.languageStats.forEach(l => {
        languageCounts[l.languageName] = (languageCounts[l.languageName] || 0) + l.problemsSolved;
      });
    }
    // Codeforces doesn't provide easy language stats in basic profile
    // GitHub provides language stats but usually in bytes. For simplicity, we use solved count if available.
  });

  const topLanguage = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "JavaScript";

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 selection:bg-blue-600/30 font-inter pb-20">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Navigation / Header */}
        <header className="flex justify-end items-center py-8 mb-12 animate-fade-in">
          <button
            onClick={handleShare}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${copied
              ? "bg-green-600 text-white"
              : "bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-xl"
              }`}
          >
            {copied ? <FiCheckCircle className="text-lg" /> : <FiShare2 className="text-lg" />}
            {copied ? "Copied" : "Share"}
          </button>
        </header>

        {/* Profile Identity Card */}
        <div className="glass-card-premium p-1 md:p-1.5 rounded-[3.5rem] mb-12 border-none ring-1 ring-white/5 overflow-hidden group">
          <div className="bg-[#050505]/80 backdrop-blur-3xl rounded-[3.4rem] p-10 md:p-16 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-transparent blur-3xl -mr-20 -mt-20"></div>

            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-[3.5rem] bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 p-[3px] shadow-[0_20px_50px_rgba(59,130,246,0.2)] group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="w-full h-full rounded-[3.4rem] bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                      <span className="text-8xl font-black text-white/10 italic">
                        {userProfile.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#0A0A0A] rounded-3xl flex items-center justify-center shadow-2xl border-[6px] border-[#0A0A0A] group-hover:rotate-12 transition-all">
                  <div className="w-full h-full rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow-inner">
                    <FiAward />
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
                  <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none">
                    {userProfile.name}
                  </h1>
                  {userProfile.role === "admin" && (
                    <span className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-blue-600/30">System Admin</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/5 border border-blue-500/10 text-blue-400 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl">
                    <FiTarget className="text-sm" /> @{userProfile.username}
                  </div>
                  <div className="text-gray-500 font-bold text-xs flex items-center gap-2 px-2">
                    <FiCalendar className="text-blue-500/50" /> Joined {new Date(userProfile.memberSince).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
                  </div>
                </div>

                {userProfile.bio && (
                  <p className="text-gray-400 text-xl font-medium max-w-2xl mb-10 leading-relaxed italic opacity-90 border-l-4 border-blue-600/30 pl-6 py-2">
                    "{userProfile.bio}"
                  </p>
                )}

                <div className="flex flex-wrap justify-center lg:justify-start gap-10">
                  {userProfile.location && (
                    <div className="flex items-center gap-3 text-gray-400 group/item">
                      <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover/item:border-blue-500/30 group-hover/item:text-blue-400 transition-all">
                        <FiMapPin />
                      </div>
                      <span className="text-sm font-black tracking-tight uppercase opacity-60 group-hover/item:opacity-100">{userProfile.location}</span>
                    </div>
                  )}
                  {userProfile.website && (
                    <a
                      href={userProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-400 group/item hover:text-blue-400 transition-all"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover/item:border-blue-400/30 group-hover/item:bg-blue-500/5">
                        <FiGlobe />
                      </div>
                      <span className="text-sm font-black tracking-tight uppercase opacity-60 group-hover/item:opacity-100">{new URL(userProfile.website).hostname.replace('www.', '')}</span>
                    </a>
                  )}
                  {userProfile.socials && userProfile.socials.map((s, si) => (
                    <div key={si} className="flex items-center gap-3 text-gray-400 group/item">
                      <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover/item:border-blue-400/30 group-hover/item:text-blue-400 transition-all">
                        <FiLink />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[8px] font-black uppercase text-blue-500/50 group-hover/item:text-blue-500 tracking-widest">{s.platform}</span>
                        <span className="text-sm font-black tracking-tight uppercase opacity-60 group-hover/item:opacity-100">@{s.username}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in delay-200">
          <StatBox label="GitHub Stars" value={totalGithubStars} icon={<FiStar />} color="blue" />
          <StatBox label="Problems Solved" value={aggregateStats.totalProblemsSolved} icon={<FiCode />} color="green" />
          <StatBox label="Contests Played" value={totalContests} icon={<FiActivity />} color="red" />
          <StatBox label="Most Used Language" value={topLanguage} icon={<FiTrendingUp />} color="purple" />
        </div>

        {/* Platforms Showcase */}
        <div className="mb-20">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 whitespace-nowrap">Connected Platforms</h2>
            <div className="h-px bg-gradient-to-r from-white/5 to-transparent flex-1"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {platforms.map((platform, idx) => {
              const cfg = platformConfig[platform.platform] || {
                icon: FiActivity,
                color: "#666",
                label: platform.platform,
                bg: "bg-white/5",
                border: "border-white/10",
                text: "text-white",
                gradient: "from-gray-700 to-gray-500",
                url: (u) => "#"
              };
              const Icon = cfg.icon;

              const extractDisplayStats = (p) => {
                const s = p.stats || {};
                const res = [];
                if (p.platform === "leetcode") {
                  res.push({ k: "Solved", v: s.totalSolved });
                  res.push({ k: "Rating", v: s.contestRanking?.rating });
                  res.push({ k: "Percentile", v: s.contestRanking?.topPercentage + "%" });
                  res.push({ k: "Contests", v: s.contestRanking?.attendedContestsCount });
                } else if (p.platform === "codeforces") {
                  res.push({ k: "Rating", v: s.rating });
                  res.push({ k: "Rank", v: s.rank });
                  res.push({ k: "Solved", v: s.problemsSolved });
                  res.push({ k: "Contests", v: s.totalContests });
                } else if (p.platform === "github") {
                  res.push({ k: "Repos", v: s.publicRepos });
                  res.push({ k: "Stars", v: s.totalStars });
                  res.push({ k: "Followers", v: s.followers });
                  res.push({ k: "Events", v: s.totalEvents });
                } else {
                  // Fallback for others
                  Object.entries(s).slice(0, 4).forEach(([k, v]) => res.push({ k, v }));
                }
                return res;
              };

              const displayStats = extractDisplayStats(platform);

              return (
                <div
                  key={platform.platform}
                  className="glass-card-premium p-10 group relative overflow-hidden transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-none ring-1 ring-white/5 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100 + 400}ms` }}
                >
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${cfg.gradient} blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>

                  <div className="flex items-center justify-between mb-12 relative z-10">
                    <div className="flex items-center gap-6">
                      <div
                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${cfg.bg} ${cfg.border}`}
                      >
                        <Icon style={{ color: cfg.color }} className="text-3xl" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{cfg.label}</h3>
                        <div className="flex items-center gap-3">
                          {platform.platform === "codechef" ? (
                            <p className={`${cfg.text} opacity-80 font-black text-[10px] uppercase tracking-[0.3em]`}>
                              Rating: {platform.stats?.rating || "N/A"}
                            </p>
                          ) : platform.platform === "atcoder" ? (
                            <p className={`${cfg.text} opacity-80 font-black text-[10px] uppercase tracking-[0.3em]`}>
                              Solved: {platform.stats?.problemsSolved || 0}
                            </p>
                          ) : (
                            <p className={`${cfg.text} opacity-50 font-black text-[10px] uppercase tracking-[0.3em]`}>@{platform.username}</p>
                          )}
                          <a
                            href={cfg.url(platform.username)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all group/btn"
                            title="View External Profile"
                          >
                            <FiExternalLink className="text-[10px] group-hover/btn:scale-110 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right opacity-30 group-hover:opacity-60 transition-opacity">
                      <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Last Updated</div>
                      <p className="text-white font-bold text-[10px]">{new Date(platform.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                    {displayStats.map((stat, si) => (
                      <div key={si} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-all hover:scale-[1.02]">
                        <div className="text-[8px] font-black uppercase tracking-[0.1em] text-gray-500 mb-2 truncate">
                          {stat.k.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="text-lg font-black text-white italic tracking-tighter">
                          {typeof stat.v === 'number' ? Math.round(stat.v).toLocaleString() : (stat.v || "—")}
                        </div>
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
          <div className="mb-20">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 whitespace-nowrap">Neutral Medals Secured</h2>
              <div className="h-px bg-gradient-to-r from-white/5 to-transparent flex-1"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aggregateStats.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="glass-card-premium p-6 flex items-center gap-6 group hover:bg-white/[0.03] transition-all border-none ring-1 ring-white/5 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 50 + 800}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-white/5 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all shadow-inner">
                    <span className="filter grayscale group-hover:grayscale-0 transition-all duration-500">{badge.icon || "🎖️"}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-black text-[11px] uppercase tracking-[0.2em] mb-1">{badge.label}</h4>
                    <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest opacity-60">{badge.platform}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Footer */}
        <footer className="mt-40 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-blue-600/50 to-transparent -top-24"></div>
          <p className="text-gray-700 font-black text-[10px] uppercase tracking-[0.8em] mb-10">Neural Identity Tracked via</p>
          <Link to="/" className="inline-block group mb-12">
            <h2 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter group-hover:text-blue-500 transition-all duration-500">
              DEVLOG<span className="text-blue-600 group-hover:animate-pulse">_</span>
            </h2>
          </Link>
          <div className="flex justify-center gap-12 text-gray-600 text-[9px] font-black uppercase tracking-[0.4em]">
            <span>© 2026 COMMAND CENTER</span>
            <span className="text-white/5">•</span>
            <span>SECURE TERMINAL</span>
            <span className="text-white/5">•</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon, color }) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="glass-card-premium p-10 group relative transition-all border-none ring-1 ring-white/5 overflow-hidden">
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-5 transition-opacity duration-700 blur-3xl ${colors[color].split(' ')[1]}`}></div>
      <div className="flex items-center justify-between mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-inner border ${colors[color]}`}>
          {icon}
        </div>
        <div className={`w-2 h-2 rounded-full ${colors[color].split(' ')[0]} animate-pulse`} />
      </div>
      <div className="text-4xl md:text-5xl font-black text-white mb-2 italic tracking-tighter group-hover:translate-x-1 transition-transform">
        {value === 0 ? "0" : (value || "-")}
      </div>
      <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">{label}</div>
    </div>
  );
}
