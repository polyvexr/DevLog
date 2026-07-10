import { SiGithub } from "react-icons/si";
import { FiStar, FiGitBranch, FiExternalLink } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { usePlatformStats } from "../hooks/useApi";
import { unlinkPlatform } from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";
import {
  PlatformDetailsHeader,
  StatBox,
  SectionHeader,
  LanguageStats
} from "../components/PlatformDetails";

export default function GitHubDetails() {
  const navigate = useNavigate();
  const { data, loading, error, stats } = usePlatformStats("github");

  const handleUnlink = async () => {
    if (!window.confirm("Are you sure you want to disconnect GitHub?")) return;
    try {
      await unlinkPlatform("github");
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
        This account is not yet connected. Connect your GitHub account to monitor statistics.
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
          platform="github"
          username={data.username}
          icon={SiGithub}
          title="GitHub"
          onUnlink={handleUnlink}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Total Stars" value={stats.totalStars || 0} colSpan={2} />
        <StatBox label="Projects" value={stats.publicRepos || 0} />
        <StatBox label="Followers" value={stats.followers || 0} />
      </div>

      <div>
        <SectionHeader title="Account Activity" dotColor="bg-[#e23e2d]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Total Actions" value={stats.totalEvents || 0} />
          <StatBox label="Derived Projects" value={stats.totalForks || 0} />
          <StatBox label="Following" value={stats.following || 0} />
          <StatBox label="Gists" value={stats.publicGists || 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SectionHeader title="Top Repositories" dotColor="bg-[#e23e2d]" />
          <div className="space-y-3">
            {stats.topRepositories?.slice(0, 5).map((repo, idx) => (
              <div key={idx} className="bg-[#121214] border border-[#222225] hover:border-neutral-700 p-5 rounded-xl transition-all flex flex-col justify-between min-h-[140px] group">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-mono text-xs font-bold text-slate-100 group-hover:text-[#e23e2d] transition-colors truncate">{repo.name}</h3>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                    <FiExternalLink size={13} />
                  </a>
                </div>
                <p className="text-[10px] text-slate-500 font-mono line-clamp-2 my-3">{repo.description || "No description provided."}</p>
                <div className="flex items-center gap-4 text-[8px] font-mono font-semibold uppercase tracking-wider text-slate-600">
                  <div className="flex items-center gap-1.5"><FiStar /> {repo.stars}</div>
                  <div className="flex items-center gap-1.5"><FiGitBranch /> {repo.forks}</div>
                  {repo.language && <div className="ml-auto text-slate-500">{repo.language}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeader title="Recent Activity" dotColor="bg-[#e23e2d]" />
          <div className="bg-[#121214] border border-[#222225] rounded-xl divide-y divide-[#222225]/40 overflow-hidden mb-6">
            {stats.recentActivity?.slice(0, 8).map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-[#0c0c0c]/50 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-60"></div>
                  <div className="font-mono text-xs text-slate-200 truncate pr-4">{event.type.replace('Event', '')}</div>
                </div>
                <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider truncate max-w-[150px] flex-shrink-0">
                  {event.repo.split('/')[1]}
                </div>
              </div>
            ))}
          </div>
          <LanguageStats languages={stats.languagesUsed} title="Languages Used" dotColor="bg-[#e23e2d]" />
        </div>
      </div>
    </div>
  );
}
