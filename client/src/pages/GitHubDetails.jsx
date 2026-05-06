import { SiGithub } from "react-icons/si";
import { FiStar, FiGitBranch, FiEye, FiExternalLink } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
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
    if (!window.confirm("Are you sure you want to disconnect GitHub? You can re-link after 2 days.")) return;
    try {
      await unlinkPlatform("github");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to disconnect service");
    }
  };

  if (loading) return <FullPageLoader />;
  if (error || !data) return (
    <div className="text-center py-20 px-4">
      <h2 className="text-3xl font-black text-white mb-4 italic uppercase">Service Not Linked</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">This account is not yet linked. Please connect your GitHub account to see your projects and information.</p>
      <button onClick={() => window.location.href = '/link'} className="glass-card-premium px-8 py-3 text-blue-400 font-black tracking-widest uppercase hover:scale-105 transition-transform active:scale-95">Link Now</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <PlatformDetailsHeader
        platform="github"
        username={data.username}
        icon={SiGithub}
        iconColor="#ffffff"
        iconBgColor="#181717"
        title="GitHub"
        onUnlink={handleUnlink}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatBox label="Total Stars" value={stats.totalStars || 0} subValue="Stars" colSpan={2} valueColor="text-yellow-400" />
        <StatBox label="Projects" value={stats.publicRepos || 0} />
        <StatBox label="Followers" value={stats.followers || 0} valueColor="text-blue-400" />
      </div>

      <div className="mb-16">
        <SectionHeader title="Account Activity" dotColor="bg-purple-500" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatBox label="Total Actions" value={stats.totalEvents || 0} subValue="Actions" />
          <StatBox label="Derived Projects" value={stats.totalForks || 0} valueColor="text-cyan-400" />
          <StatBox label="Following" value={stats.following || 0} />
          <StatBox label="Gists" value={stats.publicGists || 0} valueColor="text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <SectionHeader title="Top Repositories" dotColor="bg-blue-500" />
          <div className="space-y-4">
            {stats.topRepositories?.slice(0, 5).map((repo, idx) => (
              <div key={idx} className="glass-card-premium p-6 hover:bg-white/5 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors uppercase italic truncate pr-4">{repo.name}</h3>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                    <FiExternalLink />
                  </a>
                </div>
                <p className="text-xs text-gray-400 mb-6 font-medium line-clamp-2">{repo.description || "No description provided."}</p>
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <div className="flex items-center gap-2"><FiStar className="text-yellow-500" /> {repo.stars}</div>
                  <div className="flex items-center gap-2"><FiGitBranch className="text-purple-500" /> {repo.forks}</div>
                  {repo.language && <div className="ml-auto text-blue-400">{repo.language}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader title="Recent Activity" dotColor="bg-green-500" />
          <div className="glass-card-premium p-4 mb-8">
            <div className="space-y-1">
              {stats.recentActivity?.slice(0, 8).map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 opacity-50 group-hover:scale-150 transition-transform"></div>
                    <div className="font-bold text-white group-hover:text-cyan-400 transition-colors truncate max-w-[200px]">{event.type.replace('Event', '')}</div>
                  </div>
                  <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest truncate max-w-[150px]">
                    {event.repo.split('/')[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <LanguageStats languages={stats.languagesUsed} title="Languages Used" dotColor="bg-cyan-500" />
        </div>
      </div>
    </div>
  );
}
