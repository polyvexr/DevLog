import React, { useState } from "react";
import { SiGithub } from "react-icons/si";
import { FiStar, FiGitBranch, FiExternalLink } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { usePlatformStats } from "../hooks/useApi";
import { unlinkPlatform } from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";
import DisconnectDialog from "../components/DisconnectDialog";
import { PlatformDetailsHeader, StatBox, SectionHeader, LanguageStats } from "../components/PlatformDetails";

export default function GitHubDetails() {
  const navigate = useNavigate();
  const { data, loading, error, stats } = usePlatformStats("github");
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
  const handleUnlink = async () => { setUnlinkDialogOpen(true); };
  const confirmUnlink = async () => { setUnlinkDialogOpen(false); try { await unlinkPlatform("github"); navigate("/"); } catch (err) { alert(err.response?.data?.message || "Failed to disconnect service"); } };
  const repoNameOnly = (fullName) => fullName.split('/')[1];

  if (loading) return <FullPageLoader />;
  if (error || !data) return (
    <div className="bg-white border border-slate-200 p-12 text-center rounded-xl space-y-6 max-w-lg mx-auto mt-12">
      <h2 className="text-xl font-[Cormorant_Garamond] font-semibold italic text-slate-900">Service Not Linked</h2>
      <p className="text-slate-500 text-xs font-mono max-w-xs mx-auto leading-relaxed">This account is not yet connected. Connect your GitHub profile to monitor statistics.</p>
      <button onClick={() => window.location.href = '/settings'} className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer">Link Account →</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-12">
      <div className="space-y-4">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors">← Back to Dashboard</Link>
        <PlatformDetailsHeader platform="github" username={data.username} icon={SiGithub} title="GitHub" onUnlink={handleUnlink} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Repositories" value={stats.publicRepos || 0} />
        <StatBox label="Total Stars" value={stats.totalStars || 0} />
        <StatBox label="Total Forks" value={stats.totalForks || 0} />
        <StatBox label="Followers" value={stats.followers || 0} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SectionHeader title="Popular Repositories" dotColor="bg-[#e23e2d]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.topRepos?.slice(0, 4).map((repo, idx) => (
              <div key={idx} className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-xl transition-all cursor-pointer flex flex-col justify-between" onClick={() => window.open(repo.url, "_blank")}>
                <div>
                  <h4 className="font-mono text-xs text-slate-900 uppercase font-bold tracking-wider mb-2 truncate">{repo.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono line-clamp-2 leading-relaxed mb-4">{repo.description || "No description provided"}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><FiStar size={11} className="text-yellow-500" /><span className="text-[10px] font-mono text-slate-600">{repo.stars}</span></div>
                    <div className="flex items-center gap-1.5"><FiGitBranch size={11} className="text-blue-500" /><span className="text-[10px] font-mono text-slate-600">{repo.forks}</span></div>
                  </div>
                  <FiExternalLink size={12} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <SectionHeader title="Recent Activity" dotColor="bg-[#e23e2d]" />
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden mb-6">
            {stats.recentActivity?.slice(0, 8).map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-60"></div>
                  <div className="font-mono text-xs text-slate-700 truncate pr-4">{event.type.replace('Event', '')}</div>
                </div>
                <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider truncate max-w-[150px] flex-shrink-0">{repoNameOnly(event.repo)}</div>
              </div>
            ))}
          </div>
          <LanguageStats languages={stats.languagesUsed} title="Languages Used" dotColor="bg-[#e23e2d]" />
        </div>
      </div>
      <DisconnectDialog open={unlinkDialogOpen} platform="github" onConfirm={confirmUnlink} onCancel={() => setUnlinkDialogOpen(false)} />
    </div>
  );
}
