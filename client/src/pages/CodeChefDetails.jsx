import { SiCodechef } from "react-icons/si";
import { useNavigate, Link } from "react-router-dom";
import { usePlatformStats } from "../hooks/useApi";
import { unlinkPlatform } from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";
import {
  PlatformDetailsHeader,
  StatBox,
  DifficultyGrid,
  ContestHistoryList
} from "../components/PlatformDetails";

export default function CodeChefDetails() {
  const navigate = useNavigate();
  const { data, loading, error, stats } = usePlatformStats("codechef");

  const handleUnlink = async () => {
    if (!window.confirm("Are you sure you want to disconnect CodeChef? You can re-link after 2 days.")) return;
    try {
      await unlinkPlatform("codechef");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unlink platform");
    }
  };

  if (loading) return <FullPageLoader />;
  if (error || !data) return (
    <div className="bg-[#121214] border border-[#222225] p-12 text-center rounded-xl space-y-6 max-w-lg mx-auto mt-12">
      <h2 className="text-xl font-[Cormorant_Garamond] font-semibold italic text-white">Service Not Linked</h2>
      <p className="text-slate-400 text-xs font-mono max-w-xs mx-auto leading-relaxed">
        This account is not yet connected. Connect your CodeChef profile to monitor statistics.
      </p>
      <button
        onClick={() => window.location.href = '/settings'}
        className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
      >
        Link Account →
      </button>
    </div>
  );

  const getStarColor = (stars) => {
    const colors = { 1: "#666", 2: "#1E7D22", 3: "#3366CC", 4: "#684273", 5: "#FFBF00", 6: "#FF7F00", 7: "#D0011B" };
    return colors[stars] || "#666";
  };

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
          platform="codechef"
          username={data.username}
          icon={SiCodechef}
          title="CodeChef"
          onUnlink={handleUnlink}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          label="Current Rating"
          value={stats.rating || 0}
          subValue={`/ ${stats.highestRating || 0} Peak`}
          colSpan={2}
        />
        <div className="bg-[#121214] border border-[#222225] p-5 rounded-xl space-y-2">
          <div className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-500">Star Rating</div>
          <div className="text-3xl font-mono font-bold leading-none" style={{ color: getStarColor(stats.stars) }}>
            {"★".repeat(stats.stars || 1)}
          </div>
        </div>
        <StatBox label="Division" value={stats.division || "—"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatBox label="Global Rank" value={`#${stats.globalRank?.toLocaleString() || "—"}`} />
        <StatBox label="Country Rank" value={`#${stats.countryRank?.toLocaleString() || "—"}`} subValue={stats.countryName} />
      </div>

      <DifficultyGrid
        title="Solved Problems"
        dotColor="bg-[#e23e2d]"
        difficulties={{
          total: stats.totalSolved || 0,
          easy: stats.problemsSolved?.easy || 0,
          medium: stats.problemsSolved?.medium || 0,
          hard: stats.problemsSolved?.hard || 0,
          challenge: stats.problemsSolved?.challenge || 0
        }}
      />

      <ContestHistoryList
        contests={stats.ratingHistory?.slice().map(c => ({
          contestName: c.contestName || c.contestCode,
          rank: c.rank,
          rating: c.rating,
          date: c.date
        }))}
        platform="codechef"
      />
    </div>
  );
}
