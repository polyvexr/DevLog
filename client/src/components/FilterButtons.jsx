import React from "react";
import { FiFilter } from "react-icons/fi";

const filters = [
  { key: "all", label: "All" },
  { key: "high", label: "High Progress" },
  { key: "medium", label: "Medium Progress" },
  { key: "low", label: "Low Progress" },
];

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FiFilter className="text-[var(--text-secondary)] mr-1" size={16} />
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`filter-btn ${activeFilter === filter.key ? "filter-btn-active" : ""}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
