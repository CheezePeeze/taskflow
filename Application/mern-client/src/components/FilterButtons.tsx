import React from "react";

// Filter type (it is better to put it in a separate types.ts to use everywhere)
export type FilterType = "all" | "active" | "completed";

interface FilterButtonsProps {
  currentFilter: FilterType; // Current active filter
  onFilterChange: (filter: FilterType) => void; //callback fn for switching
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex gap-2 mb-4">
      {["all", "active", "completed"].map((filter) => (
        <button
          key={filter}
          className={`px-3 py-1 rounded ${
            currentFilter === filter ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => onFilterChange(filter as FilterType)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};
export default FilterButtons;
