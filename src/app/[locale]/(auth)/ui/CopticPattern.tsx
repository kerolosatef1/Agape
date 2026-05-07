"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const CopticPattern: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const crosses: HTMLDivElement[] = [];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.12">
            <!-- Coptic Cross Shape -->
            <rect x="85" y="10" width="30" height="180" rx="4" fill="#1a1a6e"/>
            <rect x="10" y="65" width="180" height="30" rx="4" fill="#1a1a6e"/>
            <!-- Diamond tips -->
            <polygon points="100,0 115,15 100,30 85,15" fill="#c4943d"/>
            <polygon points="100,170 115,185 100,200 85,185" fill="#c4943d"/>
            <polygon points="0,80 15,65 30,80 15,95" fill="#c4943d"/>
            <polygon points="170,80 185,65 200,80 185,95" fill="#c4943d"/>
            <!-- Center circle -->
            <circle cx="100" cy="80" r="12" fill="none" stroke="#c4943d" stroke-width="3"/>
            <circle cx="100" cy="80" r="5" fill="#c4943d"/>
          </g>
        </svg>
      `;
      el.style.position = "absolute";
      el.style.pointerEvents = "none";
      container.appendChild(el);
      crosses.push(el);
    }

    const ctx = gsap.context(() => {
      crosses.forEach((cross, i) => {
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const size = 0.5 + Math.random() * 1;

        gsap.set(cross, {
          left: `${startX}%`,
          top: `${startY}%`,
          scale: size,
          opacity: 0.15 + Math.random() * 0.2,
          rotation: Math.random() * 360,
        });

        gsap.to(cross, {
          y: -20 - Math.random() * 30,
          x: (Math.random() - 0.5) * 40,
          duration: 10 + Math.random() * 8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 1.2,
        });

        gsap.to(cross, {
          rotation: `+=${(Math.random() - 0.5) * 30}`,
          duration: 15 + Math.random() * 10,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.5,
        });

        gsap.to(cross, {
          opacity: 0.08 + Math.random() * 0.15,
          duration: 5 + Math.random() * 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.8,
        });
      });
    }, container);

    return () => {
      ctx.revert();
      crosses.forEach((c) => c.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default CopticPattern;