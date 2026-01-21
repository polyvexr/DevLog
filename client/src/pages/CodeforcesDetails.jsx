import React from "react";
import { SiCodeforces } from "react-icons/si";
import { usePlatformStats } from "../hooks/useApi";
import FullPageLoader from "../components/FullPageLoader";
import { 
  PlatformDetailsHeader, 
  StatBox, 
  SectionHeader, 
  ContestHistoryList,
  LanguageStats 
} from "../components/PlatformDetails";

export default function CodeforcesDetails() {
  const { data, loading, error, stats } = usePlatformStats("codeforces");

  if (loading) return <FullPageLoader />;
  if (error || !data) return (
    <div className="text-center py-20 px-4">
       <h2 className="text-3xl font-black text-white mb-4 italic uppercase">Engine Disconnected</h2>
       <p className="text-gray-400 mb-8 max-w-md mx-auto">Neural link to Codeforces engine failed. Please initialize your identity in the command center.</p>
       <button onClick={() => window.location.href='/link'} className="glass-card-premium px-8 py-3 text-blue-400 font-black tracking-widest uppercase hover:scale-105 transition-transform active:scale-95">Link Codeforces</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <PlatformDetailsHeader 
        platform="codeforces"
        username={data.username}
        icon={SiCodeforces}
        iconColor="#1f8eff"
        iconBgColor="#1a1a1a"
        title="Codeforces"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatBox label="Functional Rank" value={stats.rank || "Unrated"} valueColor="text-yellow-400" colSpan={2} />
        <StatBox label="Total Solving" value={stats.problemsSolved || 0} />
        <StatBox label="Contribution" value={`+${stats.contribution || 0}`} valueColor="text-green-400" />
      </div>

      <div className="mb-16">
        <SectionHeader title="Performance Matrix" dotColor="bg-blue-500" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatBox label="Current Rating" value={stats.rating || 0} className="ring-1 ring-blue-500/20" />
          <StatBox label="Peak Rating" value={stats.maxRating || 0} valueColor="text-purple-400" className="ring-1 ring-purple-500/20" />
          <StatBox label="Accepted" value={stats.acceptedSubmissions || 0} valueColor="text-green-400" />
          <StatBox label="Simulations" value={stats.totalContests || 0} valueColor="text-cyan-400" />
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
        accentColor="#1f8eff"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <SectionHeader title="Logic Verdicts" dotColor="bg-cyan-500" />
          <div className="grid grid-cols-2 gap-4">
             {stats.verdictDistribution && Object.entries(stats.verdictDistribution).slice(0, 6).map(([verdict, count]) => (
               <div key={verdict} className="glass-card-premium p-6 border-none ring-1 ring-white/5 hover:ring-white/20 transition-all">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{verdict.replace(/_/g, ' ')}</div>
                  <div className={`text-3xl font-black ${verdict === 'OK' ? 'text-green-400' : 'text-gray-300'}`}>{count}</div>
               </div>
             ))}
          </div>
        </div>

        <LanguageStats 
          languages={stats.languagesUsed} 
          title="Syntax Library"
          dotColor="bg-purple-500"
        />
      </div>
    </div>
  );
}
