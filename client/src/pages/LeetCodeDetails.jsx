import { SiLeetcode } from "react-icons/si";
import { useNavigate } from "react-router-dom";
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
    <div className="text-center py-20 px-4">
      <h2 className="text-3xl font-black text-white mb-4 italic uppercase">Service Not Linked</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">This account is not yet linked. Please connect your LeetCode account to see your information here.</p>
      <button onClick={() => window.location.href = '/link'} className="glass-card-premium px-8 py-3 text-blue-400 font-black tracking-widest uppercase hover:scale-105 transition-transform active:scale-95">Link Now</button>
    </div>
  );

  const subDiff = stats.submissionsByDifficulty || {};
  const easy = subDiff.easy?.solved || 0;
  const medium = subDiff.medium?.solved || 0;
  const hard = subDiff.hard?.solved || 0;
  const total = stats.totalSolved || 0;
  const efficiency = subDiff.all?.total > 0 ? ((total / subDiff.all.total) * 100).toFixed(1) : "0.0";

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <PlatformDetailsHeader
        platform="leetcode"
        username={data.username}
        icon={SiLeetcode}
        iconColor="#FFA116"
        iconBgColor="#2c2c2c"
        title="LeetCode"
        onUnlink={handleUnlink}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatBox label="Global Rank" value={`#${stats.ranking?.toLocaleString() || "—"}`} subValue="Rank" colSpan={2} />
        <StatBox label="Reputation" value={stats.reputation?.toLocaleString() || 0} valueColor="text-purple-400" />
        <StatBox label="Profile Name" value={stats.realName || "Anonymous"} />
      </div>

      <DifficultyGrid
        title="Solved Problems"
        dotColor="bg-orange-500"
        difficulties={{
          easy: easy,
          medium: medium,
          hard: hard,
          total: total
        }}
      />

      {stats.contestRanking && (
        <div className="mb-16">
          <SectionHeader title="Contest Performance" dotColor="bg-purple-500" />
          <div className="glass-card-premium p-10 bg-gradient-to-br from-white/[0.03] to-purple-500/[0.03]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Rating</div>
                <div className="text-4xl font-black text-purple-400 italic">{stats.contestRanking.rating ? Math.round(stats.contestRanking.rating) : "N/A"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Percentile</div>
                <div className="text-4xl font-black text-cyan-400 italic">{stats.contestRanking.topPercentage ? `${stats.contestRanking.topPercentage}%` : "N/A"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Contests</div>
                <div className="text-4xl font-black text-blue-400 italic">{stats.contestRanking.attendedContestsCount || 0}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Rank</div>
                <div className="text-4xl font-black text-white italic">#{stats.contestRanking.globalRanking?.toLocaleString() || "—"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <SectionHeader title="Skills and Topics" dotColor="bg-blue-500" />
          <div className="glass-card-premium p-8 space-y-8">
            {stats.tagStats?.advanced && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">Advanced Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.tagStats.advanced.slice(0, 8).map(tag => (
                    <div key={tag.tagSlug} className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs font-bold text-white">
                      {tag.tagName} <span className="text-purple-400 ml-1">{tag.problemsSolved}</span>
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

        <div>
          <SectionHeader title="Recent Activity" dotColor="bg-green-500" />
          <div className="glass-card-premium p-4 min-h-[400px]">
            {stats.recentSubmissions?.slice(0, 8).map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 opacity-50 group-hover:scale-150 transition-transform"></div>
                  <div className="font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-[220px]">{sub.title}</div>
                </div>
                <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
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
