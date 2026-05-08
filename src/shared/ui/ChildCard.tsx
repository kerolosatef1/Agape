"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AvatarCircle from "./AvatarCircle";

interface ChildCardProps {
  name: string;
  gender: boolean;
  classLabel?: string;
  description?: string;
  sessions?: number;
  needsSupport?: boolean;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
  sessionsLabel?: string;
  needsSupportLabel?: string;
}

const ChildCardShared: React.FC<ChildCardProps> = ({
  name,
  gender,
  classLabel,
  description,
  sessions,
  needsSupport,
  footer,
  actions,
  onClick,
  sessionsLabel = "sessions",
  needsSupportLabel = "Needs support",
}) => {
  const boyBg = "linear-gradient(180deg, rgba(26, 26, 110, 0.04) 0%, rgba(26, 26, 110, 0.01) 100%)";
  const girlBg = "linear-gradient(180deg, rgba(139, 26, 58, 0.04) 0%, rgba(139, 26, 58, 0.01) 100%)";
  const topColor = gender ? "#1a1a6e" : "#8b1a3a";

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group rounded-xl border-0 shadow-sm"
      onClick={onClick}
    >
      {/* Top color bar — first thing at the top */}
      <div className="h-[3px]" style={{ backgroundColor: topColor }} />

      <CardContent
        className="pt-6 pb-4 flex flex-col items-center gap-3 relative"
        style={{ background: gender ? boyBg : girlBg }}
      >
        {/* Actions (edit/delete) */}
        {actions && (
          <div className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {actions}
          </div>
        )}

        {/* Avatar */}
        <AvatarCircle name={name} gender={gender} size="lg" />

        {/* Name */}
        <h3 className="font-semibold text-base text-center">{name}</h3>

        {/* Class info */}
        {classLabel && (
          <p className="text-sm text-muted-foreground -mt-2">{classLabel}</p>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground text-center line-clamp-2 max-w-[220px] -mt-1">
            {description}
          </p>
        )}
      </CardContent>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between border-t border-gray-100">
        {sessions !== undefined && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{sessions}</span> {sessionsLabel}
          </p>
        )}

        {needsSupport && (
          <span
            className="text-xs font-medium px-3 py-1 rounded-full border"
            style={{ color: "#8b1a3a", borderColor: "#8b1a3a" }}
          >
            {needsSupportLabel}
          </span>
        )}

        {footer}
      </div>
    </Card>
  );
};

export default ChildCardShared;