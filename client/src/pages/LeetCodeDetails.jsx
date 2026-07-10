import { SiLeetcode } from "react-icons/si";
import { useNavigate, Link } from "react-router-dom";
import { usePlatformStats } from "../hooks/useApi";
import { unlinkPlatform } from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";
import {
  PlatformDetailsHeader,
  StatBox,
  SectionHeader,
  DifficultyGrid,
  LanguageStats
} from "../components/PlatformDetails";

export default function LeetCodeDetails() {
  const navigate = useNavigate();
  const { data, loading, error, stats } = usePlatformStats("leetcode");

  const handleUnlink = async () => {
    if (!window.confirm("Are you sure you want to disconnect LeetCode? You can re-link after 2 days.")) return;
    try {
      await unlinkPlatform("leetcode");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to disconnect service");
    }
  };

  if (loading) return <FullPageLoader />;
  if (error || !data) return (
    <div className="bg-[#121214] border border-[#222225] p-12 text-center rounded-xl space-y-6 max-w-lg mx-auto mt-12">
      <h2 className="text-xl font-[Cormorant_Garamond] font-semibold italic text-white">Service Not Linked</h2>
      <p className="text-slate-400 text-xs font-mono max-w-xs mx-auto leading-relaxed">
        This account is not yet connected. Connect your LeetCode account to monitor statistics.
      </p>
      <button
        onClick={() => window.location.href = '/settings'}
        className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
      >
        Link Account →
      </button>
    </div>
  );

  const subDiff = stats.submissionsByDifficulty || {};
  const easy = subDiff.easy?.solved || 0;
  const medium = subDiff.medium?.solved || 0;
  const hard = subDiff.hard?.solved || 0;
  const total = stats.totalSolved || 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-12">
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-slate-500 hover:text-slate-200 transition-colors"
        >
          ← Back to Dashboard
        </Link>
        <PlatformDetailsHeader
          platform="leetcode"
          username={data.username}
          icon={SiLeetcode}
          title="LeetCode"
          onUnlink={handleUnlink}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Global Rank" value={`#${stats.ranking?.toLocaleString() || "—"}`} colSpan={2} />
        <StatBox label="Reputation" value={stats.reputation?.toLocaleString() || 0} />
        <StatBox label="Profile Name" value={stats.realName || "Anonymous"} />
      </div>

      <DifficultyGrid
        title="Solved Problems"
        dotColor="bg-[#e23e2d]"
        difficulties={{
          easy: easy,
          medium: medium,
          hard: hard,
          total: total
        }}
      />

      {stats.contestRanking && (
        <div className="space-y-4">
          <SectionHeader title="Contest Performance" dotColor="bg-[#e23e2d]" />
          <div className="bg-[#121214] border border-[#222225] p-6 rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
              <div className="space-y-1">
                <div className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider">Rating</div>
                <div className="text-2xl font-bold text-slate-200">{stats.contestRanking.rating ? Math.round(stats.contestRanking.rating) : "N/A"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider">Percentile</div>
                <div className="text-2xl font-bold text-slate-200">{stats.contestRanking.topPercentage ? `${stats.contestRanking.topPercentage}%` : "N/A"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider">Contests</div>
                <div className="text-2xl font-bold text-slate-200">{stats.contestRanking.attendedContestsCount || 0}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider">Rank</div>
                <div className="text-2xl font-bold text-slate-200">#{stats.contestRanking.globalRanking?.toLocaleString() || "—"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SectionHeader title="Skills and Topics" dotColor="bg-[#e23e2d]" />
          <div className="bg-[#121214] border border-[#222225] p-6 rounded-xl space-y-6">
            {stats.tagStats?.advanced && (
              <div className="space-y-3">
                <h3 className="text-[9px] font-mono font-semibold uppercase tracking-wider text-[#e23e2d]">Advanced Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.tagStats.advanced.slice(0, 8).map(tag => (
                    <div key={tag.tagSlug} className="px-3 py-1.5 bg-[#0c0c0c] border border-[#222225] rounded text-[9px] font-mono text-slate-300">
                      {tag.tagName} <span className="text-[#e23e2d] ml-1">{tag.problemsSolved}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <LanguageStats
              languages={stats.languageStats?.reduce((acc, curr) => ({ ...acc, [curr.languageName]: curr.problemsSolved }), {})}
              title="Languages Used"
            />
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeader title="Recent Activity" dotColor="bg-[#e23e2d]" />
          <div className="bg-[#121214] border border-[#222225] rounded-xl divide-y divide-[#222225]/40 overflow-hidden">
            {stats.recentSubmissions?.slice(0, 8).map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-[#0c0c0c]/50 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-60"></div>
                  <div className="font-mono text-xs text-slate-200 truncate pr-4">{sub.title}</div>
                </div>
                <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider flex-shrink-0">
                  {new Date(parseInt(sub.timestamp) * 1000).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
