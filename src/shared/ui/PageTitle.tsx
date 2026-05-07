"use client";

import React from "react";

interface PageTitleProps {
  count?: number;
  countLabel?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({
  count,
  countLabel,
  title,
  description,
  action,
}) => {
  return (
    <div className="space-y-1">
      {count !== undefined && countLabel && (
        <p
          className="text-xs font-medium tracking-[0.25em] uppercase"
          style={{ color: "#c4943d" }}
        >
          — {count} {countLabel} —
        </p>
      )}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#1a1a6e" }}>
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export default PageTitle;