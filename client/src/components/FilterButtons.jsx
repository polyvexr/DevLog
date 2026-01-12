import React from "react";
import { FiFilter, FiLayers, FiTrendingUp, FiTrendingDown, FiMenu } from "react-icons/fi";

const filters = [
  { key: "all", label: "Global", icon: FiLayers },
  { key: "high", label: "Elite", icon: FiTrendingUp },
  { key: "medium", label: "Active", icon: FiMenu },
  { key: "low", label: "Initiate", icon: FiTrendingDown },
];

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/5 p-2 rounded-[24px] backdrop-blur-3xl">
      <div className="px-4 flex items-center gap-2 border-r border-white/10 hidden md:flex">
        <FiFilter className="text-gray-500" size={14} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Filter</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all
                ${isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105 active:scale-95 translate-y-[-1px]" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <Icon size={14} className={isActive ? "animate-pulse" : ""} />
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterButtons;
