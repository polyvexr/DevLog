import { SiCodechef } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { usePlatformStats } from "../hooks/useApi";
import { unlinkPlatform } from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";
import {
  PlatformDetailsHeader,
  StatBox,
  SectionHeader,
  ContestHistoryList,
  DifficultyGrid
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
    <div className="text-center py-20 px-4">
      <h2 className="text-3xl font-black text-white mb-4 italic uppercase">Service Not Linked</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">This account is not yet linked. Please connect your CodeChef profile to see your information here.</p>
      <button onClick={() => window.location.href = '/link'} className="glass-card-premium px-8 py-3 text-amber-400 font-black tracking-widest uppercase hover:scale-105 transition-transform active:scale-95">Link Now</button>
    </div>
  );

  const getStarColor = (stars) => {
    const colors = { 1: "#666", 2: "#1E7D22", 3: "#3366CC", 4: "#684273", 5: "#FFBF00", 6: "#FF7F00", 7: "#D0011B" };
    return colors[stars] || "#666";
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <PlatformDetailsHeader
        platform="codechef"
        username={data.username}
        icon={SiCodechef}
        iconColor="#5B4638"
        iconBgColor="#5B4638"
        title="CodeChef"
        onUnlink={handleUnlink}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatBox
          label="Current Rating"
          value={stats.rating || 0}
          subValue={`/ ${stats.highestRating || 0} Peak`}
          colSpan={2}
          valueColor="text-white"
        />
        <div className="glass-card-premium p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Star Rating</div>
          <div className="text-4xl font-black" style={{ color: getStarColor(stats.stars) }}>
            {"★".repeat(stats.stars || 1)}
          </div>
        </div>
        <StatBox label="Division" value={stats.division || "—"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <StatBox label="Global Rank" value={`#${stats.globalRank?.toLocaleString() || "—"}`} />
        <StatBox label="Country Rank" value={`#${stats.countryRank?.toLocaleString() || "—"}`} subValue={stats.countryName} />
      </div>

      <DifficultyGrid
        title="Solved Problems"
        dotColor="bg-amber-500"
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
        accentColor="#5B4638"
      />
    </div>
  );
}
