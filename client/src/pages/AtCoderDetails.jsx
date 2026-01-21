import React from "react";
import { usePlatformStats } from "../hooks/useApi";
import FullPageLoader from "../components/FullPageLoader";
import { 
  PlatformDetailsHeader, 
  StatBox, 
  SectionHeader, 
  ContestHistoryList 
} from "../components/PlatformDetails";

export default function AtCoderDetails() {
  const { data, loading, error, stats } = usePlatformStats("atcoder");

  if (loading) return <FullPageLoader />;
  if (error || !data) return (
    <div className="text-center py-20 px-4">
       <h2 className="text-3xl font-black text-white mb-4 italic uppercase">Nodes Offline</h2>
       <p className="text-gray-400 mb-8 max-w-md mx-auto">Neural access to AtCoder lattice denied. Please initialize your identity in the command center.</p>
       <button onClick={() => window.location.href='/link'} className="glass-card-premium px-8 py-3 text-cyan-400 font-black tracking-widest uppercase hover:scale-105 transition-transform active:scale-95">Link AtCoder</button>
    </div>
  );

  const rankColors = {
    gray: "#808080", brown: "#804000", green: "#008000", cyan: "#00C0C0",
    blue: "#0000FF", yellow: "#C0C000", orange: "#FF8000", red: "#FF0000",
  };
  const rankColor = rankColors[stats.rankColor] || rankColors.gray;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <PlatformDetailsHeader 
        platform="atcoder"
        username={data.username}
        icon="AT"
        isTextIcon={true}
        iconColor="#222"
        iconBgColor="#222"
        title="AtCoder"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatBox 
          label="Current Rating" 
          value={stats.rating || 0} 
          subValue={`/ ${stats.highestRating || 0} Peak`} 
          colSpan={2} 
          valueColor=""
          className="relative"
        >
          <div className="absolute top-0 right-0 p-8 h-full flex items-center">
            <div className="w-4 h-full rounded-full" style={{ backgroundColor: rankColor }}></div>
          </div>
        </StatBox>
        <StatBox label="Rank Color" value={(stats.rankColor || "Unrated").toUpperCase()} valueColor="" style={{ color: rankColor }} />
        <StatBox label="AC Rank" value={`#${stats.acRank?.toLocaleString() || "—"}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <StatBox label="Contests" value={stats.contestsParticipated || 0} />
        <StatBox label="Avg Performance" value={stats.averagePerformance || 0} valueColor="text-cyan-400" />
        <StatBox label="Best Performance" value={stats.bestPerformance || 0} valueColor="text-green-400" />
      </div>

      <div className="mb-16">
        <SectionHeader title="Difficulty Matrix" dotColor="bg-cyan-500" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <StatBox label="Total Solved" value={stats.totalSolved || stats.acCount || 0} />
          {Object.entries(stats.solvedByDifficulty || {}).map(([color, count]) => (
            <div key={color} className="glass-card-premium p-6 border-none ring-1 ring-white/5">
              <div className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: rankColors[color] }}>{color}</div>
              <div className="text-4xl font-black italic" style={{ color: rankColors[color] }}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <ContestHistoryList 
        contests={stats.ratingHistory?.slice().reverse()} 
        platform="atcoder"
        accentColor="#222"
      />
    </div>
  );
}
