import React from "react";
import { FiLayers, FiCode } from "react-icons/fi";

const SummarySection = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-xl animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Platforms Tracked", value: summary?.totalPlatforms || 0, icon: FiLayers },
    { label: "Problems Solved", value: summary?.totalProblemsSolved || 0, icon: FiCode },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white border border-slate-200 p-6 rounded-xl flex justify-between items-center transition-all hover:border-slate-300">
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">{stat.label}</div>
              <div className="text-3xl font-mono font-bold text-slate-900">{stat.value}</div>
            </div>
            <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[#e23e2d] text-lg">
              <Icon />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummarySection;
