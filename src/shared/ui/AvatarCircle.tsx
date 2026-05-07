"use client";

import React from "react";

interface AvatarCircleProps {
  name: string;
  gender?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-10 h-10", text: "text-xs", ring: "3px" },
  md: { container: "w-16 h-16", text: "text-lg", ring: "3px" },
  lg: { container: "w-20 h-20", text: "text-xl", ring: "3px" },
};

const AvatarCircle: React.FC<AvatarCircleProps> = ({
  name,
  gender = true,
  size = "md",
  className = "",
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const color = gender ? "#1a1a6e" : "#8b1a3a";
  const s = sizeMap[size];

  return (
    <div
      className={`${s.container} rounded-full flex items-center justify-center ${className}`}
      style={{
        border: `${s.ring} solid ${color}`,
        backgroundColor: "transparent",
      }}
    >
      <span className={`${s.text} font-bold`} style={{ color }}>
        {initials}
      </span>
    </div>
  );
};

export default AvatarCircle;