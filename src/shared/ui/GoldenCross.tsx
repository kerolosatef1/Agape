import React from "react";

interface GoldenCrossProps {
  size?: number;
  className?: string;
}

const GoldenCross: React.FC<GoldenCrossProps> = ({ size = 40, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d060" />
          <stop offset="30%" stopColor="#d4a843" />
          <stop offset="60%" stopColor="#c4943d" />
          <stop offset="100%" stopColor="#f5d060" />
        </linearGradient>
        <filter id="goldGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Vertical bar */}
      <rect
        x="42"
        y="5"
        width="16"
        height="90"
        rx="3"
        fill="url(#goldGradient)"
        filter="url(#goldGlow)"
      />
      {/* Horizontal bar */}
      <rect
        x="20"
        y="25"
        width="60"
        height="16"
        rx="3"
        fill="url(#goldGradient)"
        filter="url(#goldGlow)"
      />
    </svg>
  );
};

export default GoldenCross;