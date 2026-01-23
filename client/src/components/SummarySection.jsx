import React from "react";
import { FiLayers, FiCode, FiTrendingUp, FiZap } from "react-icons/fi";

const SummarySection = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="glass-card-premium p-8 animate-pulse border-none ring-1 ring-white/5">
            <div className="w-12 h-12 bg-white/5 rounded-2xl mb-4" />
            <div className="h-6 bg-white/5 rounded-lg w-1/2 mb-2" />
            <div className="h-4 bg-white/5 rounded-lg w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Platforms Tracked",
      value: summary?.totalPlatforms || 0,
      icon: FiLayers,
      color: "from-blue-500 to-indigo-600",
      glow: "shadow-blue-500/20",
    },
    {
      label: "Problems Solved",
      value: summary?.totalProblemsSolved || 0,
      icon: FiCode,
      color: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/20",
    },

  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="glass-card-premium p-8 group hover:-translate-y-2">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 shadow-xl ${stat.glow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
              <Icon size={24} className="text-white" />
            </div>
            <div className="text-3xl font-black text-white mb-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-500">{stat.label}</div>

            {/* Subtle background glow on hover */}
            <div className={`absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default SummarySection;
