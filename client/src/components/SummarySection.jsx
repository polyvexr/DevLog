import React from "react";
import { FiLayers, FiCode, FiTrendingUp, FiZap } from "react-icons/fi";

const SummarySection = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="summary-card animate-pulse">
            <div className="h-8 bg-[var(--bg-card-inner)] rounded mb-2" />
            <div className="h-4 bg-[var(--bg-card-inner)] rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Platforms Tracked",
      value: summary?.platformsLinked || 0,
      icon: FiLayers,
      color: "#4d8af0",
    },
    {
      label: "Problems Solved",
      value: summary?.totalProblemsSolved || 0,
      icon: FiCode,
      color: "#10b981",
    },
    {
      label: "Average Progress",
      value: `${summary?.averageProgress || 0}%`,
      icon: FiTrendingUp,
      color: "#8b5cf6",
    },
    {
      label: "Active Streak",
      value: summary?.activeStreak || 0,
      icon: FiZap,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="summary-card">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}20` }}
              >
                <Icon size={20} style={{ color: stat.color }} />
              </div>
            </div>
            <div className="summary-card-value">{stat.value}</div>
            <div className="summary-card-label">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SummarySection;
