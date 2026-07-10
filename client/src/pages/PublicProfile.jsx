import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiShare2, FiExternalLink, FiAward, FiCheckCircle, FiTarget, FiZap, FiActivity, FiMapPin, FiGlobe, FiCalendar, FiTrendingUp, FiCode, FiLink, FiStar } from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";
import api from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";

const AtCoderIcon = ({ className }) => <span className={`font-black text-xs ${className}`}>AT</span>;

const platformConfig = {
  leetcode: { icon: SiLeetcode, color: "#ffa116", label: "LeetCode", gradient: "from-[#ffa116] to-[#ffb84d]", url: u => `https://leetcode.com/u/${u}` },
  codeforces: { icon: SiCodeforces, color: "#1f8acb", label: "Codeforces", gradient: "from-[#1f8acb] to-[#4cb3f0]", url: u => `https://codeforces.com/profile/${u}` },
  github: { icon: SiGithub, color: "#ffffff", label: "GitHub", gradient: "from-[#333] to-[#666]", url: u => `https://github.com/${u}` },
  codechef: { icon: SiCodechef, color: "#5B4638", label: "CodeChef", gradient: "from-[#5B4638] to-[#8B7355]", url: u => `https://www.codechef.com/users/${u}` },
  atcoder: { icon: AtCoderIcon, color: "#ffffff", label: "AtCoder", gradient: "from-[#222] to-[#444]", url: u => `https://atcoder.jp/users/${u}` }
};

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/u/${username}`)
      .then(res => setData(res.data.data))
      .catch(err => setError(err.response?.status === 404 ? "Member profile not found or restricted" : "Information link lost"))
      .finally(() => setLoading(false));
  }, [username]);

  const handleShare = async () => {
    if (navigator.share) try { await navigator.share({ title: `${data.profile.name}'s DevLog`, url: window.location.href }); } catch { }
    else { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  if (loading) return <FullPageLoader />;
  if (error) return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 text-center">
      <div className="glass-card-premium p-12 max-w-lg border-none ring-1 ring-white/5 space-y-8">
        <div className="w-20 h-20 bg-red-600/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto animate-pulse"><FiZap className="text-4xl text-red-500" /></div>
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Access <span className="text-red-500">Denied</span></h1>
        <p className="text-gray-500 font-medium">{error}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-10 py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10"><FiArrowLeft /> Return to Main Page</Link>
      </div>
    </div>
  );

  const { profile: user, aggregateStats: stats, platforms } = data;
  const langCounts = {};
  platforms.forEach(p => p.platform === "leetcode" && p.stats?.languageStats?.forEach(l => langCounts[l.languageName] = (langCounts[l.languageName] || 0) + l.problemsSolved));
  const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const getDisplayStats = (p) => {
    const s = p.stats || {};
    if (p.platform === "leetcode") return [{ k: "Solved", v: s.totalSolved }, { k: "Rating", v: s.contestRanking?.rating }, { k: "Percentile", v: s.contestRanking?.topPercentage + "%" }, { k: "Contests", v: s.contestRanking?.attendedContestsCount }];
    if (p.platform === "codeforces") return [{ k: "Rating", v: s.rating }, { k: "Rank", v: s.rank }, { k: "Solved", v: s.problemsSolved }, { k: "Contests", v: s.totalContests }];
    if (p.platform === "github") return [{ k: "Repos", v: s.publicRepos }, { k: "Stars", v: s.totalStars }, { k: "Followers", v: s.followers }, { k: "Events", v: s.totalEvents }];
    if (p.platform === "codechef") return [{ k: "Rating", v: s.rating }, { k: "Stars", v: s.stars }, { k: "Solved", v: s.totalSolved }, { k: "Contests", v: s.contestsParticipated }];
    if (p.platform === "atcoder") return [{ k: "Rating", v: s.rating }, { k: "Rank", v: s.rankColor }, { k: "Solved", v: s.totalSolved }, { k: "Contests", v: s.contestsParticipated }];
    return Object.entries(s).slice(0, 4).map(([k, v]) => ({ k, v }));
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 selection:bg-blue-600/30 font-inter pb-32 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16">
        {/* Profile Identity Card */}
        <div className="glass-card-premium p-1 md:p-1.5 rounded-[3.5rem] mb-12 border-none ring-1 ring-white/5 group">
          <div className="bg-[#050505]/80 backdrop-blur-3xl rounded-[3.4rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-transparent blur-3xl -mr-20 -mt-20" />
            <div className="absolute top-10 right-10 z-20">
              <button onClick={handleShare} className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${copied ? "bg-green-600 text-white" : "bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-xl"}`}>
                {copied ? <FiCheckCircle className="text-lg" /> : <FiShare2 className="text-lg" />} {copied ? "Copied" : "Share"}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
              <div className="relative group/avatar">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-[3.5rem] bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 p-[3px] shadow-[0_20px_50px_rgba(59,130,246,0.2)] group-hover/avatar:scale-[1.02] transition-transform duration-700">
                  <div className="w-full h-full rounded-[3.4rem] bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover grayscale-[20%] group-hover/avatar:grayscale-0 transition-all duration-700" /> : <span className="text-8xl font-black text-white/10 italic">{user.name?.[0] || 'U'}</span>}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#0A0A0A] rounded-3xl flex items-center justify-center shadow-2xl border-[6px] border-[#0A0A0A] group-hover/avatar:rotate-12 transition-all"><div className="w-full h-full rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl"><FiAward /></div></div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
                  <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none">{user.name}</h1>
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/5 border border-blue-500/10 text-blue-400 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl"><FiTarget className="text-sm" /> @{user.username}</div>
                  <div className="text-gray-500 font-bold text-xs flex items-center gap-2 px-2"><FiCalendar className="text-blue-500/50" /> Joined {new Date(user.memberSince).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}</div>
                </div>
                {user.bio && <p className="text-gray-400 text-xl font-medium max-w-2xl mb-10 leading-relaxed italic border-l-4 border-blue-600/30 pl-6 py-2">"{user.bio}"</p>}
                <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                  {user.location && <StatInfo icon={<FiMapPin />} text={user.location} />}
                  {user.website && <StatInfo icon={<FiGlobe />} text={new URL(user.website).hostname.replace('www.', '')} link={user.website} />}
                  {user.socials?.map((s, i) => <StatInfo key={i} icon={<FiLink />} text={s.platform} link={s.username?.startsWith('http') ? s.username : `https://${s.username}`} />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <MetricBox label="Memberships" value={stats.platforms} icon={<FiCode />} color="blue" />
          <MetricBox label="Accomplishments" value={stats.totalProblemsSolved} icon={<FiCheckCircle />} color="green" />
          <MetricBox label="Participation" value={stats.totalContests} icon={<FiActivity />} color="red" />
          <MetricBox label="Main Focus" value={topLang} icon={<FiTrendingUp />} color="purple" />
        </div>

        {/* Linked Ecosystems */}
        <div className="mb-20">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 whitespace-nowrap">Linked Services</h2>
            <div className="h-px bg-gradient-to-r from-white/5 to-transparent flex-1" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {platforms.map((p, idx) => {
              const cfg = platformConfig[p.platform] || { icon: FiActivity, color: "#fff", label: p.platform, gradient: "from-gray-700 to-gray-500", url: () => "#" };
              const Icon = cfg.icon;
              return (
                <div key={p.platform} className="glass-card-premium p-10 group relative overflow-hidden transition-all hover:-translate-y-2 border-none ring-1 ring-white/5">
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${cfg.gradient} blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                  <div className="flex items-center justify-between mb-12 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-white/5 bg-white/5 transition-all group-hover:scale-110 group-hover:rotate-3">
                        <Icon style={{ color: cfg.color }} className="text-3xl" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{cfg.label}</h3>
                        <div className="flex items-center gap-3">
                          <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">@{p.username}</p>
                          <a href={cfg.url(p.username)} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"><FiExternalLink className="text-[10px]" /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                    {getDisplayStats(p).map((stat, si) => (
                      <div key={si} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/[0.05]">
                        <div className="text-[8px] font-black uppercase tracking-[0.1em] text-gray-500 mb-2 truncate">{stat.k.replace(/([A-Z])/g, " $1")}</div>
                        <div className="text-lg font-black text-white italic tracking-tighter">{typeof stat.v === 'number' ? Math.round(stat.v).toLocaleString() : (stat.v || "—")}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medals */}
        {stats.badges.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 whitespace-nowrap">Recognitions</h2>
              <div className="h-px bg-gradient-to-r from-white/5 to-transparent flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.badges.map((b, i) => (
                <div key={i} className="glass-card-premium p-6 flex items-center gap-6 group hover:bg-white/[0.03] transition-all border-none ring-1 ring-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all shadow-inner">
                    <span className="filter grayscale group-hover:grayscale-0 transition-all duration-500">{b.icon || "🎖️"}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-black text-[11px] uppercase tracking-[0.2em] mb-1">{b.label}</h4>
                    <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest opacity-60">{b.platform}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-40 text-center relative border-t border-white/5 pt-20">
          <Link to="/" className="inline-block group mb-12 text-5xl md:text-7xl font-black text-white italic tracking-tighter hover:text-blue-500 transition-all duration-500">DEVLOG<span className="text-blue-600">_</span></Link>
          <div className="flex justify-center flex-wrap gap-8 text-gray-600 text-[9px] font-black uppercase tracking-[0.4em]">
            <span>© 2026 MANAGEMENT CENTER</span><span>MEMBER PORTAL</span><span>ALL RIGHTS RESERVED</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon, color }) {
  const cls = { blue: "text-blue-500 bg-blue-500/10 border-blue-500/20", green: "text-green-500 bg-green-500/10 border-green-500/20", red: "text-red-500 bg-red-500/10 border-red-500/20", purple: "text-purple-500 bg-purple-500/10 border-purple-500/20" };
  return (
    <div className="glass-card-premium p-10 group relative transition-all border-none ring-1 ring-white/5 overflow-hidden">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:rotate-12 border ${cls[color]} mb-8`}>{icon}</div>
      <div className="text-4xl md:text-5xl font-black text-white mb-2 italic tracking-tighter group-hover:translate-x-1 transition-transform">{value || "0"}</div>
      <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">{label}</div>
    </div>
  );
}

function StatInfo({ icon, text, link }) {
  const content = (
    <div className="flex items-center gap-3 text-gray-400 group/item hover:text-blue-400 transition-all">
      <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover/item:border-blue-400/30 group-hover/item:bg-blue-500/5">{icon}</div>
      <span className="text-sm font-black tracking-tight uppercase opacity-60 group-hover/item:opacity-100">{text}</span>
    </div>
  );
  return link ? <a href={link} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}
