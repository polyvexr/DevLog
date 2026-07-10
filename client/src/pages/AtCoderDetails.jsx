import { useNavigate, Link } from "react-router-dom";
import { usePlatformStats } from "../hooks/useApi";
import { unlinkPlatform } from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";
import {
  PlatformDetailsHeader,
  StatBox,
  SectionHeader,
  ContestHistoryList
} from "../components/PlatformDetails";

const AtCoderIcon = () => (
  <span className="font-bold text-[8px] text-[#e23e2d] bg-[#e23e2d]/10 px-1.5 py-0.5 rounded border border-[#e23e2d]/20 font-sans">
    AT
  </span>
);

export default function AtCoderDetails() {
  const navigate = useNavigate();
  const { data, loading, error, stats } = usePlatformStats("atcoder");

  const handleUnlink = async () => {
    if (!window.confirm("Are you sure you want to disconnect AtCoder?")) return;
    try {
      await unlinkPlatform("atcoder");
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
        This account is not yet connected. Connect your AtCoder profile to monitor statistics.
      </p>
      <button
        onClick={() => window.location.href = '/settings'}
        className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
      >
        Link Account →
      </button>
    </div>
  );

  const rankColors = {
    gray: "#808080", brown: "#804000", green: "#008000", cyan: "#00C0C0",
    blue: "#0000FF", yellow: "#C0C000", orange: "#FF8000", red: "#FF0000",
  };
  const rankColor = rankColors[stats.rankColor] || rankColors.gray;

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
          platform="atcoder"
          username={data.username}
          icon={AtCoderIcon}
          isTextIcon={true}
          title="AtCoder"
          onUnlink={handleUnlink}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          label="Current Rating"
          value={stats.rating || 0}
          subValue={`/ ${stats.highestRating || 0} Peak`}
          colSpan={2}
          className="relative"
        >
          <div className="absolute top-0 right-0 p-5 h-full flex items-center">
            <div className="w-2.5 h-1/2 rounded" style={{ backgroundColor: rankColor }}></div>
          </div>
        </StatBox>
        <StatBox label="Rank Color" value={(stats.rankColor || "Unrated").toUpperCase()} valueColor="" style={{ color: rankColor }} />
        <StatBox label="AC Rank" value={`#${stats.acRank?.toLocaleString() || "—"}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox label="Competitions Joined" value={stats.contestsParticipated || 0} />
        <StatBox label="Avg Performance" value={stats.averagePerformance || 0} />
        <StatBox label="Best Performance" value={stats.bestPerformance || 0} />
      </div>

      <div>
        <SectionHeader title="Solved Problems" dotColor="bg-[#e23e2d]" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatBox label="Total Solved" value={stats.totalSolved || stats.acCount || 0} />
          {Object.entries(stats.solvedByDifficulty || {}).map(([color, count]) => (
            <div key={color} className="bg-[#121214] border border-[#222225] p-5 rounded-xl space-y-2">
              <div className="text-[8px] font-mono font-semibold uppercase tracking-wider" style={{ color: rankColors[color] }}>{color}</div>
              <div className="text-3xl font-mono font-bold" style={{ color: rankColors[color] }}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <ContestHistoryList
        contests={stats.ratingHistory?.slice().reverse()}
        platform="atcoder"
      />
    </div>
  );
}
