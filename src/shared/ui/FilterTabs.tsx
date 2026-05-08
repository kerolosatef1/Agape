"use client";

import React from "react";

interface FilterTab {
  key: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={`px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
            activeTab === tab.key
              ? "text-white"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
          style={
            activeTab === tab.key
              ? { backgroundColor: "#1a1a6e" }
              : {}
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;