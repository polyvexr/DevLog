import React from "react";
import { SiCodechef } from "react-icons/si";
import { usePlatformStats } from "../hooks/useApi";
import FullPageLoader from "../components/FullPageLoader";
import { 
  PlatformDetailsHeader, 
  StatBox, 
  SectionHeader, 
  ContestHistoryList,
  DifficultyGrid 
} from "../components/PlatformDetails";

export default function CodeChefDetails() {
  const { data, loading, error, stats } = usePlatformStats("codechef");

  if (loading) return <FullPageLoader />;
  if (error || !data) return (
    <div className="text-center py-20 px-4">
       <h2 className="text-3xl font-black text-white mb-4 italic uppercase">Chef Unavailable</h2>
       <p className="text-gray-400 mb-8 max-w-md mx-auto">Neural link to CodeChef nodes failed. Please initialize your identity in the command center.</p>
       <button onClick={() => window.location.href='/link'} className="glass-card-premium px-8 py-3 text-amber-400 font-black tracking-widest uppercase hover:scale-105 transition-transform active:scale-95">Link CodeChef</button>
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
        title="Problem Solving Matrix"
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
