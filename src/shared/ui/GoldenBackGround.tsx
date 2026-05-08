"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const GoldenBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating golden crosses
    const crosses: HTMLDivElement[] = [];
    const count = 6;

    for (let i = 0; i < count; i++) {
      const cross = document.createElement("div");
      cross.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="42" y="5" width="16" height="90" rx="3" fill="rgba(212, 168, 67, 0.08)" />
          <rect x="20" y="25" width="60" height="16" rx="3" fill="rgba(212, 168, 67, 0.08)" />
        </svg>
      `;
      cross.style.position = "absolute";
      cross.style.pointerEvents = "none";
      container.appendChild(cross);
      crosses.push(cross);
    }

    const ctx = gsap.context(() => {
      crosses.forEach((cross, i) => {
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const size = 16 + Math.random() * 24;

        gsap.set(cross, {
          left: `${startX}%`,
          top: `${startY}%`,
          scale: size / 24,
          opacity: 0.3 + Math.random() * 0.3,
        });

        // Float animation
        gsap.to(cross, {
          y: -30 - Math.random() * 40,
          x: (Math.random() - 0.5) * 60,
          duration: 8 + Math.random() * 6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 1.5,
        });

        // Subtle rotation
        gsap.to(cross, {
          rotation: (Math.random() - 0.5) * 20,
          duration: 10 + Math.random() * 5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.8,
        });

        // Pulse opacity
        gsap.to(cross, {
          opacity: 0.15 + Math.random() * 0.2,
          duration: 4 + Math.random() * 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 1.2,
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

export default GoldenBackground;