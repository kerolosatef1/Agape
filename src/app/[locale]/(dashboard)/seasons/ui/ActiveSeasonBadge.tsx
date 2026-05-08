"use client";

import React from "react";
import { useActivatedSeason } from "../hooks/seasons.hooks";
import { Calendar } from "lucide-react";

const ActiveSeasonBadge: React.FC = () => {
  const { data: season } = useActivatedSeason();

  if (!season) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 mx-3 rounded-lg bg-green-50 border border-green-200">
      <Calendar size={14} className="text-green-600 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">
          Active Season
        </p>
        <p className="text-xs font-medium text-green-800 truncate">
          {season.seasonName}
        </p>
      </div>
    </div>
  );
};

export default ActiveSeasonBadge;