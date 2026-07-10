import React, { useState } from "react";
import { SiCodeforces } from "react-icons/si";
import { useNavigate, Link } from "react-router-dom";
import { usePlatformStats } from "../hooks/useApi";
import { unlinkPlatform } from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";
import DisconnectDialog from "../components/DisconnectDialog";
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
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);

  const handleUnlink = async () => {
    setUnlinkDialogOpen(true);
  };

  const confirmUnlink = async () => {
    setUnlinkDialogOpen(false);
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
        This account is not yet connected. Connect your Codeforces profile to monitor statistics.
      </p>
      <button
        onClick={() => window.location.href = '/settings'}
        className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
      >
        Link Account →
      </button>
    </div>
  );

  const getRankColor = (rank) => {
    const ranks = {
      "newbie": "#808080",
      "pupil": "#008000",
      "specialist": "#03a89e",
      "expert": "#0000ff",
      "candidate master": "#aa00aa",
      "master": "#ff8c00",
      "international master": "#ff8c00",
      "grandmaster": "#ff0000",
      "international grandmaster": "#ff0000",
      "legendary grandmaster": "#ff0000"
    };
    return ranks[rank?.toLowerCase()] || "#808080";
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
          platform="codeforces"
          username={data.username}
          icon={SiCodeforces}
          title="Codeforces"
          onUnlink={handleUnlink}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatBox
          label="Current Rating"
          value={stats.currentRating || 0}
          subValue={`/ ${stats.maxRating || 0} Peak`}
        />
        <div className="bg-[#121214] border border-[#222225] p-5 rounded-xl space-y-2">
          <div className="text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-500">Rank</div>
          <div className="text-3xl font-[Cormorant_Garamond] font-bold italic" style={{ color: getRankColor(stats.rank) }}>
            {stats.rank || "Newbie"}
          </div>
        </div>
      </div>

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

      <DisconnectDialog
        open={unlinkDialogOpen}
        platform="codeforces"
        onConfirm={confirmUnlink}
        onCancel={() => setUnlinkDialogOpen(false)}
      />
    </div>
  );
}
