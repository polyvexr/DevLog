import { SiCodeforces } from "react-icons/si";
import { useNavigate, Link } from "react-router-dom";
import { usePlatformStats } from "../hooks/useApi";
import { unlinkPlatform } from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";
import {
  PlatformDetailsHeader,
  StatBox,
  SectionHeader,
  ContestHistoryList,
  LanguageStats
} from "../components/PlatformDetails";

export default function CodeforcesDetails() {
  const navigate = useNavigate();
  const { data, loading, error, stats } = usePlatformStats("codeforces");

  const handleUnlink = async () => {
    if (!window.confirm("Are you sure you want to disconnect Codeforces? You can re-link after 2 days.")) return;
    try {
      await unlinkPlatform("codeforces");
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
        This account is not yet connected. Connect your Codeforces account to monitor statistics.
      </p>
      <button
        onClick={() => window.location.href = '/settings'}
        className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
      >
        Link Account →
      </button>
    </div>
  );

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
          platform="codeforces"
          username={data.username}
          icon={SiCodeforces}
          title="Codeforces"
          onUnlink={handleUnlink}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Current Rank" value={stats.rank || "Unrated"} colSpan={2} />
        <StatBox label="Total Solved" value={stats.problemsSolved || 0} />
        <StatBox label="Contribution" value={`+${stats.contribution || 0}`} />
      </div>

      <div>
        <SectionHeader title="Rating and Stats" dotColor="bg-[#e23e2d]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Current Rating" value={stats.rating || 0} />
          <StatBox label="Max Rating" value={stats.maxRating || 0} />
          <StatBox label="Total Accepted" value={stats.acceptedSubmissions || 0} />
          <StatBox label="Total Contests" value={stats.totalContests || 0} />
        </div>
      </div>

      <ContestHistoryList
        contests={stats.ratingChanges?.slice().reverse().map(c => ({
          contestName: c.contestName,
          rank: c.rank,
          newRating: c.newRating,
          oldRating: c.oldRating
        }))}
        platform="codeforces"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SectionHeader title="Result Summary" dotColor="bg-[#e23e2d]" />
          <div className="grid grid-cols-2 gap-4">
            {stats.verdictDistribution && Object.entries(stats.verdictDistribution).slice(0, 6).map(([verdict, count]) => (
              <div key={verdict} className="bg-[#121214] border border-[#222225] hover:border-neutral-700 p-5 rounded-xl transition-all space-y-1">
                <div className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-500">{verdict.replace(/_/g, ' ')}</div>
                <div className={`text-2xl font-mono font-bold ${verdict === 'OK' ? 'text-green-500' : 'text-slate-300'}`}>{count}</div>
              </div>
            ))}
          </div>
        </div>

        <LanguageStats
          languages={stats.languagesUsed}
          title="Languages Used"
          dotColor="bg-[#e23e2d]"
        />
      </div>
    </div>
  );
}
