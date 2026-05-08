"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const CopticHeader: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".coptic-text",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", stagger: 0.15 },
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={headerRef}
      className="w-full py-6 px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a1a6e 0%, #0d0d4a 60%, #1a1a6e 100%)",
        borderRadius: "0 0 24px 24px",
      }}
    >
      {/* Decorative border pattern */}
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ background: "linear-gradient(90deg, transparent, #c4943d, #f5d060, #c4943d, transparent)" }}
      />

      <div className="flex flex-col items-center gap-3 relative z-10">
        {/* Coptic Cross SVG */}
        <svg width="48" height="48" viewBox="0 0 200 200" fill="none" className="coptic-text">
          <rect x="85" y="10" width="30" height="180" rx="4" fill="#c4943d"/>
          <rect x="10" y="65" width="180" height="30" rx="4" fill="#c4943d"/>
          <polygon points="100,0 115,15 100,30 85,15" fill="#f5d060"/>
          <polygon points="100,170 115,185 100,200 85,185" fill="#f5d060"/>
          <polygon points="0,80 15,65 30,80 15,95" fill="#f5d060"/>
          <polygon points="170,80 185,65 200,80 185,95" fill="#f5d060"/>
          <circle cx="100" cy="80" r="14" fill="none" stroke="#f5d060" strokeWidth="3"/>
          <circle cx="100" cy="80" r="5" fill="#f5d060"/>
        </svg>

        {/* Coptic text */}
        <p
          className="coptic-text text-sm tracking-[0.3em] text-center"
          style={{ color: "#c4943d", fontFamily: "serif" }}
        >
          Ⲫϯ ⲛⲁⲓ ⲛⲁⲛ · Ⲡⲓⲭ̅ⲥ̅ ⲁⲕⲧⲟⲛϥ
        </p>

        {/* Gold line */}
        <div
          className="coptic-text w-24 h-px mx-auto"
          style={{ background: "linear-gradient(90deg, transparent, #c4943d, transparent)" }}
        />
      </div>

      {/* Bottom gold border */}
      <div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{ background: "linear-gradient(90deg, transparent, #c4943d, #f5d060, #c4943d, transparent)" }}
      />
    </div>
  );
};

export default CopticHeader;