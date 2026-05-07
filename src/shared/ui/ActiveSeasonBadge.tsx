"use client";

import React from "react";
import { useActivatedSeason } from "../hooks/seasons.hooks";

const ActiveSeasonBadge: React.FC = () => {
  const { data: season } = useActivatedSeason();

  if (!season) return null;

  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{ background: "rgba(196, 148, 61, 0.15)", border: "1px solid rgba(196, 148, 61, 0.3)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c4943d" }}>
        ✦ Active Season
      </p>
      <p className="text-sm font-semibold text-white mt-1 truncate">
        {season.seasonName}
      </p>
    </div>
  );
};

export default ActiveSeasonBadge;