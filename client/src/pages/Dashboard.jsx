import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useApi";
import FullPageLoader from "../components/FullPageLoader";
import PlatformCard from "../components/PlatformCard";
import SummarySection from "../components/SummarySection";
import { FiBarChart2 } from "react-icons/fi";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, loading } = useDashboard();

  if (loading && !data) return <FullPageLoader />;

  const stats = data?.platforms || [];
  const summary = data?.summary || null;
  const displayName = data?.user?.name || "Developer";

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e23e2d]/10 border border-[#e23e2d]/20 text-[#e23e2d] font-mono text-[9px] font-semibold uppercase tracking-wider">
            <span>Welcome back, {displayName}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-[Cormorant_Garamond] font-light italic text-slate-900 tracking-tight leading-tight">
            Your coding <br />
            <span className="text-[#e23e2d]">workspace.</span>
          </h1>
          <p className="text-slate-500 text-xs md:text-sm max-w-xl leading-relaxed">
            Track progress and monitor live synced developer logs across LeetCode, Codeforces, GitHub, AtCoder, and CodeChef in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {data?.user?.publicProfile?.username && (
            <button
              onClick={() => window.open(`/u/${data.user.publicProfile.username}`, "_blank")}
              className="px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-mono text-[9px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Public Profile</span>
              <span className="text-slate-400">↗</span>
            </button>
          )}
        </div>
      </div>

      <SummarySection summary={summary} loading={false} />

      {stats.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center rounded-xl space-y-6 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#e23e2d]/10 border border-[#e23e2d]/20 rounded-full flex items-center justify-center mx-auto text-[#e23e2d] text-lg">
            <FiBarChart2 />
          </div>
          <h3 className="text-xl font-[Cormorant_Garamond] font-semibold italic text-slate-900">No accounts linked</h3>
          <p className="text-slate-500 text-xs font-mono max-w-xs mx-auto leading-relaxed">
            You haven't connected any platform stats yet. Link your coding profiles to view synced logs.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            Link Accounts →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((item) => (
            <PlatformCard
              key={item.platform}
              platform={item.platform}
              stats={item.stats}
              username={item.username}
              onClick={() => navigate(`/${item.platform}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
