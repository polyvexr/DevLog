import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiShare2,
  FiExternalLink,
  FiCheckCircle,
  FiTarget,
  FiZap,
  FiActivity,
  FiMapPin,
  FiGlobe,
  FiCalendar,
  FiTrendingUp,
  FiCode,
  FiLink,
} from "react-icons/fi";
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from "react-icons/si";
import api from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";

const AtCoderIcon = () => (
  <span className="font-bold text-[8px] text-[#e23e2d] bg-[#e23e2d]/10 px-1.5 py-0.5 rounded border border-[#e23e2d]/20 font-sans">
    AT
  </span>
);

const platformConfig = {
  leetcode: { icon: SiLeetcode, colorClass: "text-orange-500", label: "LeetCode", url: u => `https://leetcode.com/u/${u}` },
  codeforces: { icon: SiCodeforces, colorClass: "text-blue-500", label: "Codeforces", url: u => `https://codeforces.com/profile/${u}` },
  github: { icon: SiGithub, colorClass: "text-slate-200", label: "GitHub", url: u => `https://github.com/${u}` },
  codechef: { icon: SiCodechef, colorClass: "text-amber-600", label: "CodeChef", url: u => `https://www.codechef.com/users/${u}` },
  atcoder: { icon: AtCoderIcon, colorClass: "", label: "AtCoder", url: u => `https://atcoder.jp/users/${u}`, isTextIcon: true }
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
    if (navigator.share) {
      try {
        await navigator.share({ title: `${data.profile.name}'s DevLog`, url: window.location.href });
      } catch { }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <FullPageLoader />;
  if (error) return (
    <div className="min-h-screen bg-[#0c0c0c] text-slate-200 flex items-center justify-center p-6 text-center select-none">
      <div className="bg-[#121214] border border-[#222225] p-12 text-center rounded-xl space-y-6 max-w-lg mx-auto">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 text-lg">
          <FiZap />
        </div>
        <h1 className="text-xl font-[Cormorant_Garamond] font-semibold italic text-white">Access Denied</h1>
        <p className="text-slate-400 text-xs font-mono max-w-xs mx-auto leading-relaxed">{error}</p>
        <Link to="/" className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer">
          ← Return to Main Page
        </Link>
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
    <div className="min-h-screen bg-[#0c0c0c] text-slate-200 font-sans pb-32 overflow-x-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 pt-16 space-y-12">
        
        {/* Profile Identity Card */}
        <div className="bg-[#121214] border border-[#222225] rounded-xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="absolute top-6 right-6">
            <button
              onClick={handleShare}
              className={`px-4 py-2 text-[9px] font-mono font-semibold uppercase tracking-wider rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                copied
                  ? "bg-green-600 border-green-600 text-white font-semibold"
                  : "bg-[#0c0c0c] border-[#222225] hover:border-neutral-700 text-slate-300"
              }`}
            >
              {copied ? <FiCheckCircle size={12} /> : <FiShare2 size={12} />}
              {copied ? "Copied" : "Share Profile"}
            </button>
          </div>

          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#0c0c0c] border border-[#222225] p-1 flex-shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-[Cormorant_Garamond] font-bold text-4xl text-slate-600 italic">
                  {user.name?.[0] || 'U'}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e23e2d]/10 border border-[#e23e2d]/20 text-[#e23e2d] font-mono text-[9px] font-semibold uppercase tracking-wider">
                <span>@{user.username}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-[Cormorant_Garamond] font-light italic text-white tracking-tight leading-none">
                {user.name}
              </h1>
              <p className="font-mono text-[9px] text-slate-500 flex items-center justify-center md:justify-start gap-1">
                <FiCalendar /> Joined {new Date(user.memberSince).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {user.bio && (
              <p className="text-slate-400 text-xs italic max-w-xl border-l-2 border-[#e23e2d]/50 pl-4 py-1 text-left">
                "{user.bio}"
              </p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-1">
              {user.location && <StatInfo icon={<FiMapPin />} text={user.location} />}
              {user.website && <StatInfo icon={<FiGlobe />} text={new URL(user.website).hostname.replace('www.', '')} link={user.website} />}
              {user.socials?.map((s, i) => (
                <StatInfo key={i} icon={<FiLink />} text={s.platform} link={s.username?.startsWith('http') ? s.username : `https://${s.username}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Neural Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricBox label="Memberships" value={stats.platforms} icon={<FiCode />} />
          <MetricBox label="Problems Solved" value={stats.totalProblemsSolved} icon={<FiCheckCircle />} />
          <MetricBox label="Participation" value={stats.totalContests} icon={<FiActivity />} />
          <MetricBox label="Main Focus" value={topLang} icon={<FiTrendingUp />} />
        </div>

        {/* Linked Ecosystems */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#e23e2d] whitespace-nowrap">Linked Services</h2>
            <div className="h-px bg-[#222225] flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((p) => {
              const cfg = platformConfig[p.platform] || { icon: FiActivity, colorClass: "text-slate-400", label: p.platform, url: () => "#" };
              const Icon = cfg.icon;
              return (
                <div key={p.platform} className="bg-[#121214] border border-[#222225] hover:border-neutral-700 p-6 rounded-xl transition-all space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#0c0c0c] border border-[#222225] flex items-center justify-center text-lg">
                          {cfg.isTextIcon ? <Icon /> : <Icon className={cfg.colorClass} />}
                        </div>
                        <div>
                          <h3 className="font-[Cormorant_Garamond] font-semibold italic text-slate-100 text-lg leading-tight">{cfg.label}</h3>
                          <p className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">@{p.username}</p>
                        </div>
                      </div>
                      <a
                        href={cfg.url(p.username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#0c0c0c] border border-[#222225] rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={`Visit ${cfg.label} Profile`}
                      >
                        <FiExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#222225]/40">
                    {getDisplayStats(p).map((stat, si) => (
                      <div key={si} className="bg-[#0c0c0c] border border-[#222225] rounded p-3 space-y-1">
                        <div className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-500 truncate">
                          {stat.k}
                        </div>
                        <div className="text-sm font-mono font-bold text-slate-200 truncate">
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

        {/* Recognitions Section */}
        {stats.badges.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#e23e2d] whitespace-nowrap">Recognitions</h2>
              <div className="h-px bg-[#222225] flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.badges.map((b, i) => (
                <div key={i} className="bg-[#121214] border border-[#222225] p-5 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#0c0c0c] border border-[#222225] flex items-center justify-center text-xl flex-shrink-0">
                    <span>{b.icon || "🎖️"}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-mono text-[9px] font-semibold text-slate-200 uppercase tracking-wider truncate">{b.label}</h4>
                    <p className="font-mono text-[8px] text-slate-500 uppercase tracking-wider mt-0.5">{b.platform}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="pt-24 pb-8 text-center space-y-6 border-t border-[#222225]">
          <Link to="/" className="inline-flex items-center gap-1.5 font-[Cormorant_Garamond] font-semibold italic text-white text-xl hover:text-slate-300 transition-colors">
            <FiZap className="text-[#e23e2d] text-base" /> DevLog
          </Link>
          <div className="flex justify-center gap-6 font-mono text-[8px] text-slate-600 uppercase tracking-wider">
            <span>© {new Date().getFullYear()} devlog tracker</span>
            <span>member portal</span>
            <span>all rights reserved</span>
          </div>
        </footer>

      </div>
    </div>
  );
}

function MetricBox({ label, value, icon }) {
  return (
    <div className="bg-[#121214] border border-[#222225] p-6 rounded-xl flex justify-between items-center transition-all hover:border-neutral-700">
      <div className="space-y-1">
        <div className="text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-500">{label}</div>
        <div className="text-3xl font-mono font-bold text-white">{value || "0"}</div>
      </div>
      <div className="w-10 h-10 rounded bg-[#0c0c0c] border border-[#222225] flex items-center justify-center text-[#e23e2d] text-lg">
        {icon}
      </div>
    </div>
  );
}

function StatInfo({ icon, text, link }) {
  const content = (
    <div className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs font-mono cursor-pointer">
      <span className="text-slate-500">{icon}</span>
      <span>{text}</span>
    </div>
  );
  return link ? <a href={link} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}
